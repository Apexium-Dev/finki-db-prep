"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Play, RotateCcw, Loader2, Table } from "lucide-react";
import styles from "./ExamTaskSolver.module.css";

const SqlEditor = dynamic(() => import("@/components/SqlEditor"), { ssr: false });

const CATEGORY_LABELS: Record<string, string> = {
  dml: "DML",
  ddl: "DDL",
  trigger: "Тригер",
  er: "ER Дијаграм",
  relations: "Релациска Шема",
};

const SQL_CATEGORIES = new Set(["dml", "ddl", "trigger"]);

interface ExamTask {
  id: string;
  category: string;
  difficulty: number;
  title: string;
  prompt: string;
  setup_sql: string | null;
  points: number;
}

interface QueryRow {
  [col: string]: unknown;
}

interface RunResult {
  rows: QueryRow[];
  columns: string[];
  error: string | null;
  affectedRows?: number;
}

export default function ExamTaskSolver({ task }: { task: ExamTask }) {
  const [sql, setSql] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const dbRef = useRef<import("@electric-sql/pglite").PGlite | null>(null);

  const isSqlTask = SQL_CATEGORIES.has(task.category);

  async function getDb() {
    if (dbRef.current) return dbRef.current;
    const { PGlite } = await import("@electric-sql/pglite");
    const db = new PGlite();
    if (task.setup_sql?.trim()) {
      await db.exec(task.setup_sql);
    }
    dbRef.current = db;
    return db;
  }

  async function handleRun() {
    if (!sql.trim()) return;
    setRunning(true);
    setResult(null);
    try {
      const db = await getDb();
      const res = await db.query<QueryRow>(sql);
      const columns = res.fields.map((f) => f.name);
      setResult({ rows: res.rows, columns, error: null });
    } catch (e) {
      setResult({ rows: [], columns: [], error: String(e) });
    } finally {
      setRunning(false);
    }
  }

  function handleReset() {
    dbRef.current = null;
    setSql("");
    setResult(null);
  }

  return (
    <div className={styles.layout}>
      {/* Header bar */}
      <div className={styles.taskBar}>
        <div className={styles.taskBarLeft}>
          <Link href="/exam" className={styles.backBtn}>
            <ArrowLeft size={14} strokeWidth={2.5} />
            Стари Испити
          </Link>
          <div className={styles.barDivider} />
          <span className={styles.categoryBadge}>
            {CATEGORY_LABELS[task.category] ?? task.category}
          </span>
          <span className={styles.taskTitle}>{task.title}</span>
        </div>
        <div className={styles.taskBarRight}>
          <span className={styles.pointsBadge}>{task.points} поени</span>
          {isSqlTask && (
            <button className={styles.resetBtn} onClick={handleReset} title="Ресетирај база">
              <RotateCcw size={15} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {/* Left: prompt */}
        <div className={styles.leftPanel}>
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Задача</p>
            <p className={styles.prompt}>{task.prompt}</p>
          </div>
          {task.setup_sql?.trim() && (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Шема</p>
              <pre className={styles.schemaPre}>{task.setup_sql}</pre>
            </div>
          )}
        </div>

        {/* Right: editor or note */}
        <div className={styles.rightPanel}>
          {isSqlTask ? (
            <>
              <div className={styles.editorArea}>
                <div className={styles.editorHeader}>
                  <span className={styles.editorLabel}>SQL</span>
                </div>
                <div className={styles.editorWrapper}>
                  <SqlEditor value={sql} onChange={setSql} />
                  <button
                    className={styles.runBtn}
                    onClick={handleRun}
                    disabled={running || !sql.trim()}
                    title="Изврши (Ctrl+Enter)"
                  >
                    {running
                      ? <Loader2 size={20} strokeWidth={2} className={styles.spin} />
                      : <Play size={20} strokeWidth={2.5} fill="currentColor" />
                    }
                  </button>
                </div>
              </div>

              <div className={styles.resultsArea}>
                <div className={styles.resultsHeader}>
                  <Table size={13} strokeWidth={1.8} />
                  <span className={styles.resultsLabel}>Резултат</span>
                </div>
                <div className={styles.resultsContent}>
                  {result === null ? (
                    <div className={styles.emptyResults}>
                      <p className={styles.emptyTitle}>Нема резултат</p>
                      <p className={styles.emptyHint}>Напиши SQL и притисни Run.</p>
                    </div>
                  ) : result.error ? (
                    <div className={styles.errorBox}>
                      <pre className={styles.errorText}>{result.error}</pre>
                    </div>
                  ) : result.rows.length === 0 ? (
                    <div className={styles.emptyResults}>
                      <p className={styles.emptyTitle}>Извршено успешно</p>
                      <p className={styles.emptyHint}>Нема редови за прикажување.</p>
                    </div>
                  ) : (
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            {result.columns.map((c) => (
                              <th key={c} className={styles.th}>{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.rows.map((row, i) => (
                            <tr key={i} className={styles.tr}>
                              {result.columns.map((c) => (
                                <td key={c} className={styles.td}>
                                  {row[c] === null ? <span className={styles.null}>NULL</span> : String(row[c])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className={styles.theoreticalNote}>
              <p className={styles.theoreticalText}>
                Ова е теоретска задача ({CATEGORY_LABELS[task.category] ?? task.category}) — нема SQL за извршување. Реши ја на хартија или во твој едитор.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
