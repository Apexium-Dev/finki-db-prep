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

type TabId = "prompt" | "schema" | "hints" | "result";

type AnyResult =
  | { type: "dml"; data: GradingResult }
  | { type: "ddl"; data: DdlGradingResult }
  | { type: "trigger"; data: TriggerGradingResult };

function calcScore(result: AnyResult, maxPoints: number, penaltyPercent: number): number {
  let ratio = 0;
  if (result.type === "dml") ratio = result.data.passed ? 1 : 0;
  else ratio = result.data.score / result.data.maxScore;
  return Math.round(maxPoints * ratio * (1 - penaltyPercent / 100));
}

export default function TaskSolver({ task }: { task: Task }) {
  const [sql, setSql] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("prompt");
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<AnyResult | null>(null);
  const [earnedScore, setEarnedScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const hints = (task.hints ?? []) as HintItem[];
  const walkthrough = (task.walkthrough ?? []) as WalkthroughStep[];
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const totalPenalty = hints.slice(0, hintsRevealed).reduce((s, h) => s + h.score_penalty, 0);

  const startTimeRef = useRef<number>(Date.now());
  useEffect(() => { startTimeRef.current = Date.now(); }, []);

  const tabs: { id: TabId; label: string; show: boolean }[] = [
    { id: "prompt", label: "Задача", show: true },
    { id: "schema", label: "Шема", show: !!task.setup_sql },
    { id: "hints", label: `Совети${hintsRevealed > 0 ? ` (${hintsRevealed})` : ""}`, show: hints.length > 0 },
    { id: "result", label: "Резултат", show: submitted },
  ];

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
      const passed = res.data.passed;

      setResult(res);
      setEarnedScore(score);
      setSubmitted(true);
      setActiveTab("result");

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
        data: { passed: false, studentRows: [], referenceRows: [], error: e instanceof Error ? e.message : "Непозната грешка", columns: [] },
      });
      setEarnedScore(0);
      setSubmitted(true);
      setActiveTab("result");
    } finally {
      setGrading(false);
    }
  }

  return (
    <div className={styles.layout}>
      {/* Left panel */}
      <aside className={styles.panel}>
        {/* Fixed header — always visible */}
        <div className={styles.panelHeader}>
          <div className={styles.meta}>
            <span className={styles.category}>{CATEGORY_LABELS[task.category]}</span>
            <span className={styles.difficulty}>
              {"★".repeat(task.difficulty)}{"☆".repeat(5 - task.difficulty)}
            </span>
            <span className={styles.points}>{task.points} поени</span>
          </div>
          <h1 className={styles.title}>{task.title}</h1>

          <div className={styles.tabs}>
            {tabs.filter((t) => t.show).map((t) => (
              <button
                key={t.id}
                className={`${styles.tab} ${activeTab === t.id ? styles.activeTab : ""} ${t.id === "result" ? styles.resultTab : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable tab content */}
        <div className={styles.tabContent}>
          {activeTab === "prompt" && (
            <p className={styles.prompt}>{task.prompt}</p>
          )}

          {activeTab === "schema" && (
            <pre className={styles.schema}>
              <code>{task.setup_sql || "Нема дадена шема за оваа задача."}</code>
            </pre>
          )}

          {activeTab === "hints" && (
            <HintsPanel
              hints={hints}
              revealed={hintsRevealed}
              totalPenalty={totalPenalty}
              onReveal={() => setHintsRevealed((n) => n + 1)}
              submitted={submitted}
              inline
            />
          )}

          {activeTab === "result" && result && earnedScore !== null && (
            <div className={styles.resultTab}>
              {result.type === "dml" && (
                <ResultPanel result={result.data} earnedScore={earnedScore} maxScore={task.points} />
              )}
              {result.type === "ddl" && (
                <DdlResultPanel result={result.data} earnedScore={earnedScore} maxScore={task.points} />
              )}
              {result.type === "trigger" && (
                <TriggerResultPanel result={result.data} earnedScore={earnedScore} maxScore={task.points} />
              )}
              {walkthrough.length > 0 && (
                <WalkthroughPanel steps={walkthrough} />
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Right panel — editor */}
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
