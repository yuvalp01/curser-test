"use client";
import { useState } from "react";
import { TablesView } from "./components/TablesView";
import { RelationshipsView } from "./components/RelationshipsView";
import { LookupTablesView } from "./components/LookupTablesView";


type TabId = "tables" | "relationships" | "lookups";

const tabs: { id: TabId; label: string; description: string }[] = [
  {
    id: "tables",
    label: "Tables & Columns",
    description: "Explore schemas, tables, and column definitions."
  },
  {
    id: "relationships",
    label: "Relationships",
    description: "See how tables are connected via foreign keys."
  },
  {
    id: "lookups",
    label: "Lookup Tables",
    description: "Inspect reference data and account-related lookups."
  }
];

export default function HomePage() {
  const [active, setActive] = useState<TabId>("tables");

  return (
    <div className="space-y-6">
      <section className="card space-y-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Nadlan_v24 Metadata
            </h2>
            <p className="text-sm text-slate-400">
              Readonly explorer for your Azure SQL schema, relationships, and
              lookup data.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={`tab-button ${
                  active === tab.id
                    ? "tab-button-active"
                    : "tab-button-inactive"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500">
          {tabs.find((t) => t.id === active)?.description}
        </p>
      </section>

      {active === "tables" && <TablesView />}
      {active === "relationships" && <RelationshipsView />}
      {active === "lookups" && <LookupTablesView />}
    </div>
  );
}


