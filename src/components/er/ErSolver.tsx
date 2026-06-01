"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Task, HintItem, WalkthroughStep } from "@/types/database";
import type { ErGraph } from "@/types/er";
import type { ErGradingResult } from "@/lib/grading/er";
import { gradeEr } from "@/lib/grading/er";
import ErResultPanel from "./ErResultPanel";
import HintsPanel from "@/components/HintsPanel";
import WalkthroughPanel from "@/components/WalkthroughPanel";
import { createClient } from "@/lib/supabase/client";
import styles from "./ErSolver.module.css";

const ErEditor = dynamic(() => import("./ErEditor"), { ssr: false });

type TabId = "prompt" | "hints" | "result";

export default function ErSolver({ task }: { task: Task }) {
  const [activeTab, setActiveTab] = useState<TabId>("prompt");
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<ErGradingResult | null>(null);
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
    { id: "hints", label: `Совети${hintsRevealed > 0 ? ` (${hintsRevealed})` : ""}`, show: hints.length > 0 },
    { id: "result", label: "Резултат", show: submitted },
  ];

  async function handleCheck(graph: ErGraph) {
    setGrading(true);
    try {
      const reference = JSON.parse(task.reference_solution) as ErGraph;
      const res = gradeEr(graph, reference);
      const ratio = res.maxScore > 0 ? res.score / res.maxScore : 0;
      const score = Math.round(task.points * ratio * (1 - totalPenalty / 100));

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
          answer: JSON.stringify(graph),
          is_correct: res.passed,
          score,
          hints_used: hintsRevealed,
          time_taken_seconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
        });
      }
    } finally {
      setGrading(false);
    }
  }

  return (
    <div className={styles.layout}>
      {/* Left panel */}
      <aside className={styles.panel}>
        <div className={styles.panelHeader}>
          <Link href="/dashboard" className={styles.backLink}>← Задачи</Link>
          <div className={styles.meta}>
            <span className={styles.category}>ER дијаграм</span>
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
                className={`${styles.tab} ${activeTab === t.id ? styles.activeTab : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "prompt" && (
            <p className={styles.prompt}>{task.prompt}</p>
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
            <div>
              <ErResultPanel result={result} earnedScore={earnedScore} maxScore={task.points} />
              {walkthrough.length > 0 && <WalkthroughPanel steps={walkthrough} />}
            </div>
          )}
        </div>
      </aside>

      {/* Right panel — ER canvas */}
      <div className={styles.editorPanel}>
        <div className={styles.editorHeader}>
          <span className={styles.editorLabel}>ER Дијаграм Едитор</span>
          {earnedScore !== null && (
            <span className={styles.scoreDisplay}>{earnedScore} / {task.points} поени</span>
          )}
          {grading && <span className={styles.gradingNote}>Се проверува...</span>}
        </div>
        <div className={styles.editorWrapper}>
          <ErEditor onExport={handleCheck} disabled={grading} />
        </div>
      </div>
    </div>
  );
}
