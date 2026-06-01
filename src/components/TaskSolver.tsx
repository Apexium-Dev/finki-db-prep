"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Task } from "@/types/database";
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

  function handleCheck() {
    // Grading engine wired in Phase 6
    alert("Оценувањето ќе биде достапно наускоро!");
  }

  return (
    <div className={styles.layout}>
      {/* Left panel — task description */}
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
      </aside>

      {/* Right panel — editor */}
      <div className={styles.editorPanel}>
        <div className={styles.editorHeader}>
          <span className={styles.editorLabel}>SQL Едитор</span>
          <button
            className={styles.resetBtn}
            onClick={() => setSql("")}
            title="Избриши"
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
            disabled={!sql.trim()}
          >
            Провери →
          </button>
        </div>
      </div>
    </div>
  );
}
