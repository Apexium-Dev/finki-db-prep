import { PGlite } from "@electric-sql/pglite";

export interface AspectResult {
  aspect: string;
  label: string;
  passed: boolean;
  detail?: string;
}

export interface DdlGradingResult {
  passed: boolean;
  score: number;
  maxScore: number;
  aspects: AspectResult[];
  error: string | null;
}

// Normalise aliases so "int" and "integer" both match "integer" in information_schema
const TYPE_ALIASES: Record<string, string> = {
  int: "integer",
  int4: "integer",
  int8: "bigint",
  int2: "smallint",
  decimal: "numeric",
  varchar: "character varying",
  bool: "boolean",
  "timestamp without time zone": "timestamp without time zone",
  "timestamp with time zone": "timestamp with time zone",
  timestamptz: "timestamp with time zone",
  timestamp: "timestamp without time zone",
};

function normaliseType(t: string): string {
  const lower = t.toLowerCase().trim();
  return TYPE_ALIASES[lower] ?? lower;
}

type AspectDef = Record<string, string>;

async function checkAspect(db: PGlite, def: AspectDef): Promise<AspectResult> {
  const table = def.table;
  const column = def.column;

  switch (def.aspect) {
    case "table_exists": {
      const r = await db.query<{ cnt: string }>(
        `SELECT COUNT(*)::int AS cnt FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = $1`,
        [table]
      );
      const passed = Number(r.rows[0]?.cnt) > 0;
      return {
        aspect: "table_exists",
        label: `Табелата "${table}" постои`,
        passed,
      };
    }

    case "column_exists": {
      const r = await db.query<{ cnt: string }>(
        `SELECT COUNT(*)::int AS cnt FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2`,
        [table, column]
      );
      const passed = Number(r.rows[0]?.cnt) > 0;
      return {
        aspect: "column_exists",
        label: `Колоната "${column}" постои во "${table}"`,
        passed,
      };
    }

    case "column_type": {
      const r = await db.query<{ data_type: string }>(
        `SELECT data_type FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2`,
        [table, column]
      );
      const actual = r.rows[0]?.data_type ?? "";
      const expected = normaliseType(def.expected_type);
      const passed = normaliseType(actual) === expected;
      return {
        aspect: "column_type",
        label: `"${column}" е тип ${def.expected_type}`,
        passed,
        detail: passed ? undefined : `Добиен тип: ${actual || "колоната не постои"}`,
      };
    }

    case "primary_key": {
      const r = await db.query<{ cnt: string }>(
        `SELECT COUNT(*)::int AS cnt
         FROM information_schema.table_constraints tc
         JOIN information_schema.key_column_usage kcu
           ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema   = kcu.table_schema
         WHERE tc.constraint_type = 'PRIMARY KEY'
           AND tc.table_schema = 'public'
           AND tc.table_name   = $1
           AND kcu.column_name = $2`,
        [table, column]
      );
      const passed = Number(r.rows[0]?.cnt) > 0;
      return {
        aspect: "primary_key",
        label: `"${column}" е примарен клуч во "${table}"`,
        passed,
      };
    }

    case "foreign_key": {
      const r = await db.query<{ cnt: string }>(
        `SELECT COUNT(*)::int AS cnt
         FROM information_schema.table_constraints tc
         JOIN information_schema.key_column_usage kcu
           ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema   = kcu.table_schema
         JOIN information_schema.referential_constraints rc
           ON tc.constraint_name = rc.constraint_name
         JOIN information_schema.key_column_usage kcu2
           ON rc.unique_constraint_name = kcu2.constraint_name
         WHERE tc.constraint_type = 'FOREIGN KEY'
           AND tc.table_schema  = 'public'
           AND tc.table_name    = $1
           AND kcu.column_name  = $2
           AND kcu2.table_name  = $3`,
        [table, column, def.references_table]
      );
      const passed = Number(r.rows[0]?.cnt) > 0;
      return {
        aspect: "foreign_key",
        label: `"${column}" е странски клуч кон "${def.references_table}"`,
        passed,
      };
    }

    case "not_null": {
      const r = await db.query<{ is_nullable: string }>(
        `SELECT is_nullable FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2`,
        [table, column]
      );
      const passed = r.rows[0]?.is_nullable === "NO";
      return {
        aspect: "not_null",
        label: `"${column}" е NOT NULL`,
        passed,
      };
    }

    case "unique": {
      const r = await db.query<{ cnt: string }>(
        `SELECT COUNT(*)::int AS cnt
         FROM information_schema.table_constraints tc
         JOIN information_schema.key_column_usage kcu
           ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema   = kcu.table_schema
         WHERE tc.constraint_type = 'UNIQUE'
           AND tc.table_schema = 'public'
           AND tc.table_name   = $1
           AND kcu.column_name = $2`,
        [table, column]
      );
      const passed = Number(r.rows[0]?.cnt) > 0;
      return {
        aspect: "unique",
        label: `"${column}" е UNIQUE`,
        passed,
      };
    }

    default:
      return { aspect: def.aspect, label: def.aspect, passed: false, detail: "Непознат аспект" };
  }
}

export async function gradeDdl(
  studentSql: string,
  testCases: AspectDef[]
): Promise<DdlGradingResult> {
  const db = new PGlite();

  let error: string | null = null;
  const aspects: AspectResult[] = [];

  try {
    await db.exec(studentSql);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
    await db.close();
    return {
      passed: false,
      score: 0,
      maxScore: testCases.length,
      aspects: testCases.map((def) => ({
        aspect: def.aspect,
        label: def.table ? `${def.aspect} на "${def.table}"` : def.aspect,
        passed: false,
        detail: "DDL не се извршил",
      })),
      error,
    };
  }

  for (const def of testCases) {
    try {
      const result = await checkAspect(db, def);
      aspects.push(result);
    } catch (e) {
      aspects.push({
        aspect: def.aspect,
        label: def.aspect,
        passed: false,
        detail: e instanceof Error ? e.message : String(e),
      });
    }
  }

  await db.close();

  const passedCount = aspects.filter((a) => a.passed).length;
  const passed = passedCount === testCases.length;

  return {
    passed,
    score: passedCount,
    maxScore: testCases.length,
    aspects,
    error: null,
  };
}
