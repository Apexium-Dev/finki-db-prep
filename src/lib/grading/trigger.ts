import { PGlite } from "@electric-sql/pglite";

export interface TriggerScenario {
  description: string;
  sql: string;
  should_raise: boolean;
  expected_state?: {
    table?: string;
    row_count?: number;
    query?: string;
    expected_value?: unknown;
  };
}

export interface ScenarioResult {
  description: string;
  passed: boolean;
  detail?: string;
  raised?: boolean;
}

export interface TriggerGradingResult {
  passed: boolean;
  score: number;
  maxScore: number;
  scenarios: ScenarioResult[];
  error: string | null;
}

export async function gradeTrigger(
  setupSql: string,
  studentSql: string,
  scenarios: TriggerScenario[]
): Promise<TriggerGradingResult> {
  const db = new PGlite();

  // Apply base schema
  try {
    if (setupSql.trim()) await db.exec(setupSql);
  } catch (e) {
    await db.close();
    return {
      passed: false,
      score: 0,
      maxScore: scenarios.length,
      scenarios: [],
      error: `Грешка во setup SQL: ${e instanceof Error ? e.message : String(e)}`,
    };
  }

  // Apply student's trigger
  try {
    await db.exec(studentSql);
  } catch (e) {
    await db.close();
    return {
      passed: false,
      score: 0,
      maxScore: scenarios.length,
      scenarios: scenarios.map((s) => ({
        description: s.description,
        passed: false,
        detail: "Тригерот не се креирал",
      })),
      error: `Грешка во тригерот: ${e instanceof Error ? e.message : String(e)}`,
    };
  }

  const results: ScenarioResult[] = [];

  // Run each scenario — state carries over between scenarios intentionally
  for (const scenario of scenarios) {
    let raised = false;
    let execError: string | undefined;

    try {
      await db.exec(scenario.sql);
    } catch (e) {
      raised = true;
      execError = e instanceof Error ? e.message : String(e);
    }

    // Case 1: should raise an error
    if (scenario.should_raise) {
      results.push({
        description: scenario.description,
        passed: raised,
        raised,
        detail: raised ? undefined : "Се очекуваше грешка, но SQL се извршил без грешка",
      });
      continue;
    }

    // Case 2: should succeed — also check expected_state if provided
    if (raised) {
      results.push({
        description: scenario.description,
        passed: false,
        raised: true,
        detail: `Неочекувана грешка: ${execError}`,
      });
      continue;
    }

    const es = scenario.expected_state;
    if (!es) {
      results.push({ description: scenario.description, passed: true });
      continue;
    }

    // Check row_count
    if (es.table !== undefined && es.row_count !== undefined) {
      try {
        const r = await db.query<{ cnt: string }>(
          `SELECT COUNT(*)::int AS cnt FROM ${es.table}`
        );
        const actual = Number(r.rows[0]?.cnt);
        const ok = actual === es.row_count;
        results.push({
          description: scenario.description,
          passed: ok,
          detail: ok
            ? undefined
            : `Очекувани редови: ${es.row_count}, добиени: ${actual}`,
        });
      } catch (e) {
        results.push({
          description: scenario.description,
          passed: false,
          detail: e instanceof Error ? e.message : String(e),
        });
      }
      continue;
    }

    // Check arbitrary query result
    if (es.query !== undefined && es.expected_value !== undefined) {
      try {
        const r = await db.query<Record<string, unknown>>(es.query);
        const actual = r.rows[0] ? Object.values(r.rows[0])[0] : undefined;
        const ok = String(actual) === String(es.expected_value);
        results.push({
          description: scenario.description,
          passed: ok,
          detail: ok
            ? undefined
            : `Очекувано: ${es.expected_value}, добиено: ${actual}`,
        });
      } catch (e) {
        results.push({
          description: scenario.description,
          passed: false,
          detail: e instanceof Error ? e.message : String(e),
        });
      }
      continue;
    }

    results.push({ description: scenario.description, passed: true });
  }

  await db.close();

  const passedCount = results.filter((r) => r.passed).length;

  return {
    passed: passedCount === scenarios.length,
    score: passedCount,
    maxScore: scenarios.length,
    scenarios: results,
    error: null,
  };
}
