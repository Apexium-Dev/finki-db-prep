"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { Task, HintItem, WalkthroughStep } from "@/types/database";
import type { GradingResult } from "@/lib/grading/dml";
import type { DdlGradingResult } from "@/lib/grading/ddl";
import type { TriggerGradingResult, TriggerScenario } from "@/lib/grading/trigger";
import ResultPanel from "@/components/ResultPanel";
import DdlResultPanel from "@/components/DdlResultPanel";
import TriggerResultPanel from "@/components/TriggerResultPanel";
import HintsPanel from "@/components/HintsPanel";
import WalkthroughPanel from "@/components/WalkthroughPanel";
import { createClient } from "@/lib/supabase/client";
import styles from "./TaskSolver.module.css";

const SqlEditor = dynamic(() => import("@/components/SqlEditor"), { ssr: false });

const CATEGORY_LABELS: Record<string, string> = {
  dml: "DML",
  ddl: "DDL",
  trigger: "Тригер",
  er: "ER дијаграм",
  relations: "Релации",
};

type AnyResult =
  | { type: "dml"; data: GradingResult }
  | { type: "ddl"; data: DdlGradingResult }
  | { type: "trigger"; data: TriggerGradingResult };

function calcScore(result: AnyResult, maxPoints: number, penaltyPercent: number): number {
  let ratio = 0;
  if (result.type === "dml") ratio = result.data.passed ? 1 : 0;
  else if (result.type === "ddl") ratio = result.data.score / result.data.maxScore;
  else ratio = result.data.score / result.data.maxScore;

  return Math.round(maxPoints * ratio * (1 - penaltyPercent / 100));
}

export default function TaskSolver({ task }: { task: Task }) {
  const [sql, setSql] = useState("");
  const [activeTab, setActiveTab] = useState<"prompt" | "schema">("prompt");
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<AnyResult | null>(null);
  const [earnedScore, setEarnedScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const hints = (task.hints ?? []) as HintItem[];
  const walkthrough = (task.walkthrough ?? []) as WalkthroughStep[];
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const totalPenalty = hints.slice(0, hintsRevealed).reduce((s, h) => s + h.score_penalty, 0);

  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  async function handleCheck() {
    if (!sql.trim()) return;
    setGrading(true);
    setResult(null);
    setEarnedScore(null);

    try {
      let res: AnyResult;

      if (task.category === "ddl") {
        const { gradeDdl } = await import("@/lib/grading/ddl");
        const data = await gradeDdl(sql, (task.test_cases ?? []) as Record<string, string>[]);
        res = { type: "ddl", data };
      } else if (task.category === "trigger") {
        const { gradeTrigger } = await import("@/lib/grading/trigger");
        const data = await gradeTrigger(
          task.setup_sql,
          sql,
          (task.test_cases ?? []) as unknown as TriggerScenario[]
        );
        res = { type: "trigger", data };
      } else {
        const { gradeDml } = await import("@/lib/grading/dml");
        const data = await gradeDml(task.setup_sql, task.seed_sql, sql, task.reference_solution);
        res = { type: "dml", data };
      }

      const score = calcScore(res, task.points, totalPenalty);
      const passed =
        res.type === "dml" ? res.data.passed :
        res.type === "ddl" ? res.data.passed : res.data.passed;

      setResult(res);
      setEarnedScore(score);
      setSubmitted(true);

      // Persist submission
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("submissions") as any).insert({
          user_id: user.id,
          task_id: task.id,
          answer: sql,
          is_correct: passed,
          score,
          hints_used: hintsRevealed,
          time_taken_seconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
        });
      }
    } catch (e) {
      setResult({
        type: "dml",
        data: {
          passed: false,
          studentRows: [],
          referenceRows: [],
          error: e instanceof Error ? e.message : "Непозната грешка",
          columns: [],
        },
      });
      setEarnedScore(0);
      setSubmitted(true);
    } finally {
      setGrading(false);
    }
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.panel}>
        <div className={styles.meta}>
          <span className={styles.category}>{CATEGORY_LABELS[task.category]}</span>
          <span className={styles.difficulty}>
            {"★".repeat(task.difficulty)}{"☆".repeat(5 - task.difficulty)}
          </span>
          <span className={styles.points}>{task.points} поени</span>
        </div>

        <h1 className={styles.title}>{task.title}</h1>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "prompt" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("prompt")}
          >
            Задача
          </button>
          <button
            className={`${styles.tab} ${activeTab === "schema" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("schema")}
          >
            Шема
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "prompt" && (
            <p className={styles.prompt}>{task.prompt}</p>
          )}
          {activeTab === "schema" && (
            <pre className={styles.schema}>
              <code>{task.setup_sql || "Нема дадена шема за оваа задача."}</code>
            </pre>
          )}
        </div>

        <HintsPanel
          hints={hints}
          revealed={hintsRevealed}
          totalPenalty={totalPenalty}
          onReveal={() => setHintsRevealed((n) => n + 1)}
          submitted={submitted}
        />

        {result?.type === "dml" && earnedScore !== null && (
          <ResultPanel result={result.data} earnedScore={earnedScore} maxScore={task.points} />
        )}
        {result?.type === "ddl" && earnedScore !== null && (
          <DdlResultPanel result={result.data} earnedScore={earnedScore} maxScore={task.points} />
        )}
        {result?.type === "trigger" && earnedScore !== null && (
          <TriggerResultPanel result={result.data} earnedScore={earnedScore} maxScore={task.points} />
        )}

        {submitted && walkthrough.length > 0 && (
          <WalkthroughPanel steps={walkthrough} />
        )}
      </aside>

      <div className={styles.editorPanel}>
        <div className={styles.editorHeader}>
          <span className={styles.editorLabel}>SQL Едитор</span>
          <button
            className={styles.resetBtn}
            onClick={() => { setSql(""); setResult(null); setEarnedScore(null); }}
          >
            Ресет
          </button>
        </div>

        <div className={styles.editorWrapper}>
          <SqlEditor value={sql} onChange={setSql} />
        </div>

        <div className={styles.actions}>
          {earnedScore !== null && (
            <span className={styles.scoreDisplay}>
              {earnedScore} / {task.points} поени
            </span>
          )}
          <button
            className={styles.checkBtn}
            onClick={handleCheck}
            disabled={!sql.trim() || grading}
          >
            {grading ? "Се проверува..." : "Провери →"}
          </button>
        </div>
      </div>
    </div>
  );
}
