"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Play, RotateCcw, AlignLeft, Trash2 } from "lucide-react";
import type { Task, HintItem, WalkthroughStep } from "@/types/database";
import type { GradingResult } from "@/lib/grading/dml";
import type { DdlGradingResult } from "@/lib/grading/ddl";
import type { TriggerGradingResult, TriggerScenario } from "@/lib/grading/trigger";
import ResultPanel from "@/components/ResultPanel";
import DdlResultPanel from "@/components/DdlResultPanel";
import TriggerResultPanel from "@/components/TriggerResultPanel";
import WalkthroughPanel from "@/components/WalkthroughPanel";
import { createClient } from "@/lib/supabase/client";
import styles from "./TaskSolver.module.css";

const SqlEditor   = dynamic(() => import("@/components/SqlEditor"),   { ssr: false });
const SchemaViewer = dynamic(() => import("@/components/SchemaViewer"), { ssr: false });

const CATEGORY_LABELS: Record<string, string> = {
  dml: "DML Task", ddl: "DDL Task", trigger: "Trigger Task", er: "ER Task", relations: "Relations Task",
};

type AnyResult =
  | { type: "dml";     data: GradingResult }
  | { type: "ddl";     data: DdlGradingResult }
  | { type: "trigger"; data: TriggerGradingResult };

function calcScore(result: AnyResult, maxPoints: number, penaltyPercent: number): number {
  let ratio = 0;
  if (result.type === "dml") ratio = result.data.passed ? 1 : 0;
  else ratio = result.data.score / result.data.maxScore;
  return Math.round(maxPoints * ratio * (1 - penaltyPercent / 100));
}

export default function TaskSolver({ task }: { task: Task }) {
  const [sql, setSql]               = useState("");
  const [grading, setGrading]       = useState(false);
  const [result, setResult]         = useState<AnyResult | null>(null);
  const [earnedScore, setEarnedScore] = useState<number | null>(null);
  const [submitted, setSubmitted]   = useState(false);
  const [activeResultTab, setActiveResultTab] = useState<"result" | "log">("result");

  const hints      = (task.hints      ?? []) as HintItem[];
  const walkthrough = (task.walkthrough ?? []) as WalkthroughStep[];
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [openHints, setOpenHints]   = useState<Set<number>>(new Set());
  const totalPenalty = hints.slice(0, hintsRevealed).reduce((s, h) => s + h.score_penalty, 0);
  const startTimeRef = useRef<number>(Date.now());
  useEffect(() => { startTimeRef.current = Date.now(); }, []);

  function toggleHint(idx: number) {
    if (idx >= hintsRevealed) setHintsRevealed(idx + 1);
    setOpenHints((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) { next.delete(idx); } else { next.add(idx); }
      return next;
    });
  }

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
        const data = await gradeTrigger(task.setup_sql, sql, (task.test_cases ?? []) as unknown as TriggerScenario[]);
        res = { type: "trigger", data };
      } else {
        const { gradeDml } = await import("@/lib/grading/dml");
        const data = await gradeDml(task.setup_sql, task.seed_sql, sql, task.reference_solution);
        res = { type: "dml", data };
      }

      const score = calcScore(res, task.points, totalPenalty);
      setResult(res);
      setEarnedScore(score);
      setSubmitted(true);
      setActiveResultTab("result");

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("submissions") as any).insert({
          user_id: user.id,
          task_id: task.id,
          answer: sql,
          is_correct: res.data.passed,
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
      setActiveResultTab("result");
    } finally {
      setGrading(false);
    }
  }

  return (
    <div className={styles.layout}>

      {/* ── Task header bar ── */}
      <div className={styles.taskBar}>
        <div className={styles.taskBarLeft}>
          <Link href="/dashboard" className={styles.backBtn}>
            <ArrowLeft size={15} strokeWidth={2} />
            Dashboard
          </Link>
          <span className={styles.barDivider} />
          <span className={styles.taskTitle}>{task.title}</span>
          <span className={styles.categoryBadge}>{CATEGORY_LABELS[task.category]}</span>
        </div>
        <div className={styles.taskBarRight}>
          <span className={styles.pointsBadge}>{task.points} поени</span>
          <button
            className={styles.checkBtn}
            onClick={handleCheck}
            disabled={!sql.trim() || grading}
          >
            {grading ? "Се проверува..." : "Провери код"}
          </button>
        </div>
      </div>

      {/* ── Split body ── */}
      <div className={styles.body}>

        {/* Left: description + schema + hints */}
        <aside className={styles.leftPanel}>

          {/* Task description */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Задача</p>
            <p className={styles.prompt}>{task.prompt}</p>
          </div>

          {/* Schema diagram */}
          {task.setup_sql && (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>ER Дијаграм / Шема</p>
              <SchemaViewer setupSql={task.setup_sql} />
            </div>
          )}

          {/* Hints */}
          {hints.length > 0 && (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>
                Помош (Hints)
                {totalPenalty > 0 && <span className={styles.penaltyNote}>−{totalPenalty}%</span>}
              </p>
              <div className={styles.hintsList}>
                {hints.map((hint, i) => {
                  const unlocked = i < hintsRevealed;
                  const isOpen   = openHints.has(i);
                  return (
                    <div key={i} className={`${styles.hintCard} ${!unlocked ? styles.hintLocked : ""}`}>
                      <button className={styles.hintToggle} onClick={() => toggleHint(i)}>
                        <span className={styles.hintNum}>Совет {i + 1}</span>
                        {hint.score_penalty > 0 && (
                          <span className={styles.hintPenalty}>−{hint.score_penalty}%</span>
                        )}
                        <span className={`${styles.hintArrow} ${isOpen && unlocked ? styles.hintArrowOpen : ""}`}>›</span>
                      </button>
                      {isOpen && unlocked && (
                        <p className={styles.hintText}>{hint.text}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* Right: editor + results */}
        <div className={styles.rightPanel}>

          {/* Editor area */}
          <div className={styles.editorArea}>
            <div className={styles.editorHeader}>
              <span className={styles.editorLabel}>SQL_EDITOR.SQL</span>
              <div className={styles.editorTools}>
                <button className={styles.toolBtn} title="Format" onClick={() => {}}>
                  <AlignLeft size={14} strokeWidth={1.8} />
                </button>
                <button className={styles.toolBtn} title="Clear" onClick={() => setSql("")}>
                  <Trash2 size={14} strokeWidth={1.8} />
                </button>
              </div>
            </div>

            <div className={styles.editorWrapper}>
              <SqlEditor value={sql} onChange={setSql} />
              <button
                className={styles.runBtn}
                onClick={handleCheck}
                disabled={!sql.trim() || grading}
                title="Провери код"
              >
                {grading
                  ? <RotateCcw size={18} strokeWidth={2} className={styles.spin} />
                  : <Play size={18} strokeWidth={2} style={{ marginLeft: 2 }} />
                }
              </button>
            </div>
          </div>

          {/* Results area */}
          <div className={styles.resultsArea}>
            <div className={styles.resultsTabs}>
              <button
                className={`${styles.resultsTab} ${activeResultTab === "result" ? styles.resultsTabActive : ""}`}
                onClick={() => setActiveResultTab("result")}
              >
                Резултати
              </button>
              <button
                className={`${styles.resultsTab} ${activeResultTab === "log" ? styles.resultsTabActive : ""}`}
                onClick={() => setActiveResultTab("log")}
              >
                Output лог
              </button>
              {earnedScore !== null && (
                <span className={`${styles.scoreChip} ${result?.data.passed ? styles.scorePass : styles.scoreFail}`}>
                  {earnedScore} / {task.points} pts
                </span>
              )}
            </div>

            <div className={styles.resultsContent}>
              {!submitted ? (
                <div className={styles.emptyResults}>
                  <div className={styles.emptyIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
                    </svg>
                  </div>
                  <p className={styles.emptyTitle}>Нема извршени прашања</p>
                  <p className={styles.emptyHint}>Напишете прашалник и притиснете на копчето за да ги видите резултатите тука.</p>
                </div>
              ) : activeResultTab === "result" && result && earnedScore !== null ? (
                <div className={styles.resultInner}>
                  {result.type === "dml"     && <ResultPanel        result={result.data} earnedScore={earnedScore} maxScore={task.points} />}
                  {result.type === "ddl"     && <DdlResultPanel     result={result.data} earnedScore={earnedScore} maxScore={task.points} />}
                  {result.type === "trigger" && <TriggerResultPanel result={result.data} earnedScore={earnedScore} maxScore={task.points} />}
                  {walkthrough.length > 0 && result.data.passed && <WalkthroughPanel steps={walkthrough} />}
                </div>
              ) : activeResultTab === "log" ? (
                <div className={styles.logArea}>
                  <pre className={styles.logText}>
                    {result
                      ? `-- Грешка: ${result.data.error ?? "нема грешка"}\n-- Резултат: ${result.data.passed ? "✓ Точно" : "✗ Неточно"}`
                      : "-- Нема лог уште"
                    }
                  </pre>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
