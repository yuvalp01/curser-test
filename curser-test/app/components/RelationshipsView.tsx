"use client";

import { useEffect, useMemo, useState } from "react";
import type { RelationshipMetadata } from "@/app/api/metadata/relationships/route";

export const RelationshipsView: React.FC = () => {
  const [relationships, setRelationships] = useState<RelationshipMetadata[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRelationships = async () => {
      try {
        const res = await fetch("/api/metadata/relationships");
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(body?.error || "Failed to load relationships");
        }
        const data = (await res.json()) as RelationshipMetadata[];
        setRelationships(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    void fetchRelationships();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return relationships;
    const q = search.toLowerCase();
    return relationships.filter((r) => {
      const parent = `${r.parentSchema}.${r.parentTable}.${r.parentColumn}`.toLowerCase();
      const referenced = `${r.referencedSchema}.${r.referencedTable}.${r.referencedColumn}`.toLowerCase();
      return (
        parent.includes(q) ||
        referenced.includes(q) ||
        r.foreignKeyName.toLowerCase().includes(q)
      );
    });
  }, [relationships, search]);

  const groupedByParent = useMemo(
    () =>
      filtered.reduce<Record<string, RelationshipMetadata[]>>(
        (acc, rel) => {
          const key = `${rel.parentSchema}.${rel.parentTable}`;
          if (!acc[key]) acc[key] = [];
          acc[key].push(rel);
          return acc;
        },
        {}
      ),
    [filtered]
  );

  if (loading) {
    return (
      <div className="card">
        <p className="text-sm text-slate-300">
          Loading foreign key relationships...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-red-800 bg-red-950/40 text-red-100">
        <p className="font-medium">Error loading relationships</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-300">
            {relationships.length} relationships discovered.
          </p>
          <p className="text-xs text-slate-500">
            Search by table, column, or foreign key name.
          </p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search relationships..."
          className="w-full md:w-64 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div className="space-y-3">
        {Object.entries(groupedByParent).map(([parent, rels]) => (
          <div key={parent} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{parent}</p>
                <p className="text-xs text-slate-500">
                  {rels.length} outgoing relationship
                  {rels.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="px-2 py-1.5 font-medium">Foreign key</th>
                    <th className="px-2 py-1.5 font-medium">From</th>
                    <th className="px-2 py-1.5 font-medium">To</th>
                  </tr>
                </thead>
                <tbody>
                  {rels.map((rel) => (
                    <tr
                      key={`${rel.foreignKeyName}-${rel.parentColumn}-${rel.referencedColumn}`}
                      className="border-b border-slate-900 last:border-0"
                    >
                      <td className="px-2 py-1.5 text-slate-200">
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-200">
                          {rel.foreignKeyName}
                        </span>
                      </td>
                      <td className="px-2 py-1.5 text-slate-100">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400">
                            Parent
                          </span>
                          <span>
                            {rel.parentSchema}.{rel.parentTable}.
                            <span className="font-medium">
                              {rel.parentColumn}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-1.5 text-slate-100">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400">
                            Referenced
                          </span>
                          <span>
                            {rel.referencedSchema}.{rel.referencedTable}.
                            <span className="font-medium">
                              {rel.referencedColumn}
                            </span>
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


