export interface ColumnDef {
  name: string;
  type: string;
  isPrimary: boolean;
  references?: { table: string; column: string };
}

export interface TableDef {
  name: string;
  columns: ColumnDef[];
}

export function parseSqlSchema(sql: string): TableDef[] {
  const tables: TableDef[] = [];

  // Match each CREATE TABLE block
  const blockRe = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?["'`]?(\w+)["'`]?\s*\(([\s\S]+?)\)\s*;/gi;
  let blockMatch: RegExpExecArray | null;

  while ((blockMatch = blockRe.exec(sql)) !== null) {
    const tableName = blockMatch[1];
    const body = blockMatch[2];

    // Table-level PRIMARY KEY (col1, col2)
    const tablePKMatch = /PRIMARY\s+KEY\s*\(([^)]+)\)/i.exec(body);
    const pkCols = new Set(
      tablePKMatch
        ? tablePKMatch[1].split(",").map((s) => s.trim().replace(/["'`]/g, "").toLowerCase())
        : []
    );

    // Table-level FOREIGN KEY (col) REFERENCES tbl(col)
    const tableFKRe = /FOREIGN\s+KEY\s*\(["'`]?(\w+)["'`]?\)\s+REFERENCES\s+["'`]?(\w+)["'`]?\s*\(["'`]?(\w+)["'`]?\)/gi;
    const tableFKs: Record<string, { table: string; column: string }> = {};
    let fkM: RegExpExecArray | null;
    while ((fkM = tableFKRe.exec(body)) !== null) {
      tableFKs[fkM[1].toLowerCase()] = { table: fkM[2], column: fkM[3] };
    }

    // Split body into logical lines (commas outside parens)
    const lines: string[] = [];
    let depth = 0, cur = "";
    for (const ch of body) {
      if (ch === "(") { depth++; cur += ch; }
      else if (ch === ")") { depth--; cur += ch; }
      else if (ch === "," && depth === 0) { lines.push(cur.trim()); cur = ""; }
      else { cur += ch; }
    }
    if (cur.trim()) lines.push(cur.trim());

    const columns: ColumnDef[] = [];
    const SKIP = new Set(["primary", "foreign", "unique", "check", "constraint", "index"]);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Skip constraint-only lines
      if (/^(PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE|CHECK|CONSTRAINT)\b/i.test(trimmed)) continue;

      // Column: name type [...]
      const colMatch = /^["'`]?(\w+)["'`]?\s+([\w]+(?:\s*\([^)]*\))?)/i.exec(trimmed);
      if (!colMatch) continue;

      const colName = colMatch[1];
      if (SKIP.has(colName.toLowerCase())) continue;

      const colType = colMatch[2].toUpperCase().replace(/\s*\(.*\)/, (m) => m); // keep e.g. VARCHAR(100)

      const isPrimary =
        pkCols.has(colName.toLowerCase()) ||
        /PRIMARY\s+KEY/i.test(trimmed) ||
        /\bSERIAL\b.*\bPRIMARY\b/i.test(trimmed) ||
        /\bINT\b.*\bPRIMARY\b/i.test(trimmed);

      // Inline REFERENCES
      const inlineRef = /REFERENCES\s+["'`]?(\w+)["'`]?\s*\(["'`]?(\w+)["'`]?\)/i.exec(trimmed);
      const ref = tableFKs[colName.toLowerCase()] ??
        (inlineRef ? { table: inlineRef[1], column: inlineRef[2] } : undefined);

      columns.push({ name: colName, type: colType, isPrimary, references: ref });
    }

    if (columns.length > 0) tables.push({ name: tableName, columns });
  }

  return tables;
}
