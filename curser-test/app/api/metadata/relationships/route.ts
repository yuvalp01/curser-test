import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbPool } from "@/lib/db";

const RelationshipRowSchema = z.object({
  ForeignKeyName: z.string(),
  ParentSchema: z.string(),
  ParentTable: z.string(),
  ParentColumn: z.string(),
  ReferencedSchema: z.string(),
  ReferencedTable: z.string(),
  ReferencedColumn: z.string()
});

export interface RelationshipMetadata {
  foreignKeyName: string;
  parentSchema: string;
  parentTable: string;
  parentColumn: string;
  referencedSchema: string;
  referencedTable: string;
  referencedColumn: string;
}

const RELATIONSHIPS_QUERY = `
SELECT
  fk.name AS ForeignKeyName,
  s1.name AS ParentSchema,
  tp.name AS ParentTable,
  cp.name AS ParentColumn,
  s2.name AS ReferencedSchema,
  tr.name AS ReferencedTable,
  cr.name AS ReferencedColumn
FROM
  sys.foreign_keys fk
INNER JOIN
  sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
INNER JOIN
  sys.tables tp ON fkc.parent_object_id = tp.object_id
INNER JOIN
  sys.schemas s1 ON tp.schema_id = s1.schema_id
INNER JOIN
  sys.columns cp ON fkc.parent_object_id = cp.object_id AND fkc.parent_column_id = cp.column_id
INNER JOIN
  sys.tables tr ON fkc.referenced_object_id = tr.object_id
INNER JOIN
  sys.schemas s2 ON tr.schema_id = s2.schema_id
INNER JOIN
  sys.columns cr ON fkc.referenced_object_id = cr.object_id AND fkc.referenced_column_id = cr.column_id
ORDER BY
  s1.name, tp.name, fk.name;
`;

export async function GET() {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query(RELATIONSHIPS_QUERY);

    const rows = z.array(RelationshipRowSchema).parse(result.recordset);

    const relationships: RelationshipMetadata[] = rows.map((row) => ({
      foreignKeyName: row.ForeignKeyName,
      parentSchema: row.ParentSchema,
      parentTable: row.ParentTable,
      parentColumn: row.ParentColumn,
      referencedSchema: row.ReferencedSchema,
      referencedTable: row.ReferencedTable,
      referencedColumn: row.ReferencedColumn
    }));

    return NextResponse.json(relationships, { status: 200 });
  } catch (error) {
    console.error("Error fetching relationship metadata", error);
    return NextResponse.json(
      { error: "Failed to fetch relationship metadata" },
      { status: 500 }
    );
  }
}


