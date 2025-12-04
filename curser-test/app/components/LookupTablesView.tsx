"use client";

import { useEffect, useState } from "react";
import type {
  LookupRow,
  LookupTablesResponse
} from "@/app/api/metadata/lookup-tables/route";

type ActiveTab = keyof LookupTablesResponse | "all";

export const LookupTablesView: React.FC = () => {
  const [data, setData] = useState<LookupTablesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<ActiveTab>("all");

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const res = await fetch("/api/metadata/lookup-tables");
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(body?.error || "Failed to load lookup tables");
        }
        const json = (await res.json()) as LookupTablesResponse;
        setData(json);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    void fetchLookups();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <p className="text-sm text-slate-300">Loading lookup tables...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-red-800 bg-red-950/40 text-red-100">
        <p className="font-medium">Error loading lookup tables</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card">
        <p className="text-sm text-slate-300">
          No lookup tables data was returned.
        </p>
      </div>
    );
  }

  const tableNames = Object.keys(data) as (keyof LookupTablesResponse)[];

  const renderTable = (name: keyof LookupTablesResponse, rows: LookupRow[]) => {
    if (!rows.length) {
      return (
        <div key={name} className="card">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-slate-500 mt-1">No rows returned.</p>
        </div>
      );
    }

    const columns = Object.keys(rows[0] ?? {});

    return (
      <div key={name} className="card space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-slate-500">
            {rows.length} row{rows.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-2 py-1.5 font-medium">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-900 last:border-0"
                >
                  {columns.map((col) => (
                    <td key={col} className="px-2 py-1.5 text-slate-100">
                      {String(row[col] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-300">
            {tableNames.length} lookup tables loaded.
          </p>
          <p className="text-xs text-slate-500">
            Quickly inspect reference data and accounts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActive("all")}
            className={`tab-button ${
              active === "all" ? "tab-button-active" : "tab-button-inactive"
            }`}
          >
            All
          </button>
          {tableNames.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setActive(name)}
              className={`tab-button ${
                active === name
                  ? "tab-button-active"
                  : "tab-button-inactive"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {active === "all"
          ? tableNames.map((name) => renderTable(name, data[name] ?? []))
          : renderTable(active, data[active] ?? [])}
      </div>
    </div>
  );
};


