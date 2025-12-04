import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbPool } from "@/lib/db";

const LOOKUP_TABLES = [
  "lkp_apartmentStatus",
  "lkp_investmentType",
  "lkp_personalTransTypes",
  "lkp_stakeholderTypes",
  "lkp_qualityLevel",
  "accounts"
] as const;

export type LookupTableName = (typeof LOOKUP_TABLES)[number];

const LookupRowSchema = z.record(z.string(), z.unknown());

export type LookupRow = z.infer<typeof LookupRowSchema>;

export type LookupTablesResponse = Record<LookupTableName, LookupRow[]>;

export async function GET() {
  try {
    const pool = await getDbPool();

    const data: Partial<LookupTablesResponse> = {};

    for (const table of LOOKUP_TABLES) {
      const result = await pool
        .request()
        .query<LookupRow>(`SELECT * FROM ${table}`);

      const rows = z.array(LookupRowSchema).parse(result.recordset);
      data[table] = rows;
    }

    return NextResponse.json(data satisfies LookupTablesResponse, {
      status: 200
    });
  } catch (error) {
    console.error("Error fetching lookup tables", error);
    return NextResponse.json(
      { error: "Failed to fetch lookup tables" },
      { status: 500 }
    );
  }
}


