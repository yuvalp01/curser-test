import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbPool } from "@/lib/db";

const TableRowSchema = z.object({
  TABLE_SCHEMA: z.string(),
  TABLE_NAME: z.string(),
  COLUMN_NAME: z.string(),
  DATA_TYPE: z.string(),
  IS_NULLABLE: z.string(),
  CHARACTER_MAXIMUM_LENGTH: z.number().nullable()
});

export interface ColumnMetadata {
  name: string;
  dataType: string;
  isNullable: boolean;
  maxLength: number | null;
}

export interface TableMetadata {
  schema: string;
  table: string;
  columns: ColumnMetadata[];
}

const TABLES_QUERY = `
SELECT
  TABLE_SCHEMA,
  TABLE_NAME,
  COLUMN_NAME,
  DATA_TYPE,
  IS_NULLABLE,
  CHARACTER_MAXIMUM_LENGTH
FROM
  INFORMATION_SCHEMA.COLUMNS
WHERE
  TABLE_SCHEMA NOT IN ('sys')
  AND TABLE_NAME NOT IN ('accountTypes')
ORDER BY
  TABLE_SCHEMA, TABLE_NAME, ORDINAL_POSITION;
`;

export async function GET() {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query(TABLES_QUERY);

    const rows = z.array(TableRowSchema).parse(result.recordset);

    const tableMap = new Map<string, TableMetadata>();

    for (const row of rows) {
      const key = `${row.TABLE_SCHEMA}.${row.TABLE_NAME}`;
      let table = tableMap.get(key);

      if (!table) {
        table = {
          schema: row.TABLE_SCHEMA,
          table: row.TABLE_NAME,
          columns: []
        };
        tableMap.set(key, table);
      }

      table.columns.push({
        name: row.COLUMN_NAME,
        dataType: row.DATA_TYPE,
        isNullable: row.IS_NULLABLE === "YES",
        maxLength: row.CHARACTER_MAXIMUM_LENGTH
      });
    }

    const tables = Array.from(tableMap.values());

    return NextResponse.json(tables, { status: 200 });
  } catch (error) {
    console.error("Error fetching table metadata", error);
    return NextResponse.json(
      { error: "Failed to fetch table metadata" },
      { status: 500 }
    );
  }
}


