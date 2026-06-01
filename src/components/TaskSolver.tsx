"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Task } from "@/types/database";
import type { GradingResult } from "@/lib/grading/dml";
import ResultPanel from "@/components/ResultPanel";
import styles from "./TaskSolver.module.css";

const SqlEditor = dynamic(() => import("@/components/SqlEditor"), { ssr: false });

const CATEGORY_LABELS: Record<string, string> = {
  dml: "DML",
  ddl: "DDL",
  trigger: "Тригер",
  er: "ER дијаграм",
  relations: "Релации",
};

interface TaskSolverProps {
  task: Task;
}

export default function TaskSolver({ task }: TaskSolverProps) {
  const [sql, setSql] = useState("");
  const [activeTab, setActiveTab] = useState<"prompt" | "schema">("prompt");
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);

  async function handleCheck() {
    if (!sql.trim()) return;
    setGrading(true);
    setResult(null);

    try {
      const { gradeDml } = await import("@/lib/grading/dml");
      const res = await gradeDml(
        task.setup_sql,
        task.seed_sql,
        sql,
        task.reference_solution
      );
      setResult(res);
    } catch (e) {
      setResult({
        passed: false,
        studentRows: [],
        referenceRows: [],
        error: e instanceof Error ? e.message : "Непозната грешка",
        columns: [],
      });
    } finally {
      setGrading(false);
    }
  }

  return (
    <div className={styles.layout}>
      {/* Left panel */}
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

        {result && <ResultPanel result={result} points={task.points} />}
      </aside>

      {/* Right panel */}
      <div className={styles.editorPanel}>
        <div className={styles.editorHeader}>
          <span className={styles.editorLabel}>SQL Едитор</span>
          <button
            className={styles.resetBtn}
            onClick={() => { setSql(""); setResult(null); }}
          >
            Ресет
          </button>
        </div>

        <div className={styles.editorWrapper}>
          <SqlEditor value={sql} onChange={setSql} />
        </div>

        <div className={styles.actions}>
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
