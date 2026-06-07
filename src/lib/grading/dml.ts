import { PGlite } from "@electric-sql/pglite";

export interface GradingResult {
  passed: boolean;
  studentRows: Record<string, unknown>[];
  referenceRows: Record<string, unknown>[];
  error: string | null;
  columns: string[];
}

function normalizeRows(rows: Record<string, unknown>[]): string {
  return JSON.stringify(
    rows.map((r) => JSON.stringify(r, Object.keys(r).sort())).sort()
  );
}

function hasOrderBy(sql: string): boolean {
  return /\bORDER\s+BY\b/i.test(sql);
}

function projectToRefCols(
  rows: Record<string, unknown>[],
  refCols: string[]
): Record<string, unknown>[] {
  return rows.map((r) => Object.fromEntries(refCols.map((c) => [c, r[c]])));
}

function rowsEqual(
  student: Record<string, unknown>[],
  reference: Record<string, unknown>[],
  orderSensitive: boolean
): boolean {
  if (student.length !== reference.length) return false;
  const refCols = reference.length > 0 ? Object.keys(reference[0]) : [];
  const projected = projectToRefCols(student, refCols);
  if (orderSensitive) {
    return JSON.stringify(projected) === JSON.stringify(reference);
  }
  return normalizeRows(projected) === normalizeRows(reference);
}

export async function gradeDml(
  setupSql: string,
  seedSql: string,
  studentSql: string,
  referenceSql: string
): Promise<GradingResult> {
  const db = new PGlite();

  try {
    if (setupSql.trim()) await db.exec(setupSql);
    if (seedSql.trim()) await db.exec(seedSql);

    // Both queries run against the same seeded state.
    // SELECT queries don't mutate, so order doesn't matter.
    let studentRows: Record<string, unknown>[] = [];
    let error: string | null = null;

    try {
      const res = await db.query<Record<string, unknown>>(studentSql);
      studentRows = res.rows;
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }

    const refRes = await db.query<Record<string, unknown>>(referenceSql);
    const referenceRows = refRes.rows;

    const columns =
      referenceRows.length > 0 ? Object.keys(referenceRows[0]) : [];

    const orderSensitive = hasOrderBy(referenceSql);
    const passed =
      error === null && rowsEqual(studentRows, referenceRows, orderSensitive);

    return { passed, studentRows, referenceRows, error, columns };
  } finally {
    await db.close();
  }
}
