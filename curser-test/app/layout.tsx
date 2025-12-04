import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Database Metadata Viewer",
  description: "Readonly viewer for tables, columns, relationships, and lookup data"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
            <div className="container flex items-center justify-between py-4">
              <div>
                <h1 className="text-xl font-semibold tracking-tight">
                  Database Metadata Viewer
                </h1>
                <p className="text-sm text-slate-400">
                  Readonly view of Nadlan_v24 schema on Azure SQL
                </p>
              </div>
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Readonly
              </span>
            </div>
          </header>
          <main className="flex-1">
            <div className="container py-6">{children}</div>
          </main>
          <footer className="border-t border-slate-900 bg-slate-950/80">
            <div className="container py-4 text-xs text-slate-500">
              Azure SQL: hola-db-server-test.database.windows.net / Nadlan_v24
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}


