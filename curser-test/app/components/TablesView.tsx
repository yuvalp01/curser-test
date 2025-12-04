"use client";

import { useEffect, useState } from "react";
import type { TableMetadata } from "@/app/api/metadata/tables/route";

export const TablesView: React.FC = () => {
  const [tables, setTables] = useState<TableMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [openSchemas, setOpenSchemas] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await fetch("/api/metadata/tables");
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(body?.error || "Failed to load tables");
        }
        const data = (await res.json()) as TableMetadata[];
        setTables(data);

        const schemas: Record<string, boolean> = {};
        for (const t of data) {
          schemas[t.schema] = true;
        }
        setOpenSchemas(schemas);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    void fetchTables();
  }, []);

  const filtered = tables.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.schema.toLowerCase().includes(q) ||
      t.table.toLowerCase().includes(q) ||
      t.columns.some((c) => c.name.toLowerCase().includes(q))
    );
  });

  const groupedBySchema = filtered.reduce<Record<string, TableMetadata[]>>(
    (acc, table) => {
      if (!acc[table.schema]) acc[table.schema] = [];
      acc[table.schema].push(table);
      return acc;
    },
    {}
  );

  const toggleSchema = (schema: string) => {
    setOpenSchemas((prev) => ({ ...prev, [schema]: !prev[schema] }));
  };

  if (loading) {
    return (
      <div className="card">
        <p className="text-sm text-slate-300">Loading tables metadata...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-red-800 bg-red-950/40 text-red-100">
        <p className="font-medium">Error loading tables</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-300">
            {tables.length} tables loaded from Azure SQL.
          </p>
          <p className="text-xs text-slate-500">
            Search across schemas, tables, and columns.
          </p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tables or columns..."
          className="w-full md:w-64 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div className="space-y-3">
        {Object.entries(groupedBySchema).map(([schema, schemaTables]) => (
          <div key={schema} className="card">
            <button
              type="button"
              onClick={() => toggleSchema(schema)}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-300">
                  {schema[0]?.toUpperCase() ?? "?"}
                </span>
                <div>
                  <p className="font-medium">{schema}</p>
                  <p className="text-xs text-slate-500">
                    {schemaTables.length} table
                    {schemaTables.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400">
                {openSchemas[schema] ? "Collapse" : "Expand"}
              </span>
            </button>

            {openSchemas[schema] && (
              <div className="mt-4 space-y-3">
                {schemaTables.map((table) => (
                  <div
                    key={`${table.schema}.${table.table}`}
                    className="rounded-lg border border-slate-800 bg-slate-900/60 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">
                          {table.schema}.{table.table}
                        </p>
                        <p className="text-xs text-slate-500">
                          {table.columns.length} column
                          {table.columns.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 overflow-x-auto">
                      <table className="min-w-full text-left text-xs">
                        <thead className="border-b border-slate-800 text-slate-400">
                          <tr>
                            <th className="px-2 py-1.5 font-medium">Column</th>
                            <th className="px-2 py-1.5 font-medium">Type</th>
                            <th className="px-2 py-1.5 font-medium">
                              Max length
                            </th>
                            <th className="px-2 py-1.5 font-medium">
                              Nullable
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {table.columns.map((col) => (
                            <tr
                              key={col.name}
                              className="border-b border-slate-900 last:border-0"
                            >
                              <td className="px-2 py-1.5 text-slate-100">
                                {col.name}
                              </td>
                              <td className="px-2 py-1.5 text-slate-200">
                                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-300">
                                  {col.dataType}
                                </span>
                              </td>
                              <td className="px-2 py-1.5 text-slate-300">
                                {col.maxLength ?? "—"}
                              </td>
                              <td className="px-2 py-1.5">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                    col.isNullable
                                      ? "bg-slate-800 text-slate-200"
                                      : "bg-emerald-500/10 text-emerald-300"
                                  }`}
                                >
                                  {col.isNullable ? "YES" : "NO"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


