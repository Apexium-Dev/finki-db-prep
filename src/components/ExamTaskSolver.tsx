"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Play, RotateCcw, Loader2, Table, Network, X } from "lucide-react";
import { parseSqlSchema } from "@/lib/schemaParse";
import styles from "./ExamTaskSolver.module.css";

const SqlEditor    = dynamic(() => import("@/components/SqlEditor"),    { ssr: false });
const SchemaViewer = dynamic(() => import("@/components/SchemaViewer"), { ssr: false });

const CATEGORY_LABELS: Record<string, string> = {
  dml: "DML", ddl: "DDL", trigger: "Тригер", er: "ER Дијаграм", relations: "Релациска Шема",
};

const SQL_CATEGORIES = new Set(["dml", "ddl", "trigger"]);

interface ExamTask {
  id: string; category: string; difficulty: number;
  title: string; prompt: string; setup_sql: string | null; points: number;
}

interface QueryRow { [col: string]: unknown; }
interface RunResult { rows: QueryRow[]; columns: string[]; error: string | null; }

export default function ExamTaskSolver({ task }: { task: ExamTask }) {
  const [sql, setSql]           = useState("");
  const [running, setRunning]   = useState(false);
  const [result, setResult]     = useState<RunResult | null>(null);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const dbRef = useRef<import("@electric-sql/pglite").PGlite | null>(null);

  const rawSetup     = task.setup_sql?.replace(/```sql\s*/gi, "").replace(/```/g, "").trim() ?? "";
  const parsedTables = rawSetup ? parseSqlSchema(rawSetup) : [];
  const hasSchema    = parsedTables.length > 0;
  const isSqlTask    = SQL_CATEGORIES.has(task.category);

  async function getDb() {
    if (dbRef.current) return dbRef.current;
    const { PGlite } = await import("@electric-sql/pglite");
    const db = new PGlite();
    if (rawSetup) await db.exec(rawSetup);
    dbRef.current = db;
    return db;
  }

  async function handleRun() {
    if (!sql.trim()) return;
    setRunning(true); setResult(null);
    try {
      const db = await getDb();
      const res = await db.query<QueryRow>(sql);
      setResult({ rows: res.rows, columns: res.fields.map(f => f.name), error: null });
    } catch (e) {
      setResult({ rows: [], columns: [], error: String(e) });
    } finally { setRunning(false); }
  }

  function handleReset() { dbRef.current = null; setSql(""); setResult(null); }

  return (
    <>
      {/* Full-screen schema overlay */}
      {schemaOpen && (
        <div className={styles.schemaOverlay}>
          <div className={styles.overlayBar}>
            <span className={styles.overlayTitle}>Шема — {task.title}</span>
            <button className={styles.overlayClose} onClick={() => setSchemaOpen(false)}>
              <X size={18} strokeWidth={2} />
            </button>
          </div>
          <div className={styles.overlayBody}>
            <SchemaViewer setupSql={rawSetup} height="100%" />
          </div>
        </div>
      )}

      <div className={styles.layout}>
        {/* Header */}
        <div className={styles.taskBar}>
          <div className={styles.taskBarLeft}>
            <Link href="/exam" className={styles.backBtn}>
              <ArrowLeft size={14} strokeWidth={2.5} /> Стари Испити
            </Link>
            <div className={styles.barDivider} />
            <span className={styles.categoryBadge}>{CATEGORY_LABELS[task.category] ?? task.category}</span>
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
            <p className={styles.sectionLabel}>Задача</p>
            <p className={styles.prompt}>{task.prompt}</p>
            {hasSchema && (
              <button className={styles.schemaBtnLeft} onClick={() => setSchemaOpen(true)}>
                <Network size={14} strokeWidth={1.8} />
                Прегледај шема
              </button>
            )}
          </div>

          {/* Right: SQL editor or note */}
          <div className={styles.rightPanel}>
            {isSqlTask ? (
              <>
                <div className={styles.editorArea}>
                  <div className={styles.editorWrapper}>
                    <SqlEditor value={sql} onChange={setSql} />
                    <button className={styles.runBtn} onClick={handleRun} disabled={running || !sql.trim()}>
                      {running
                        ? <Loader2 size={20} strokeWidth={2} className={styles.spin} />
                        : <Play size={20} strokeWidth={2.5} fill="currentColor" />}
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
                      <div className={styles.errorBox}><pre className={styles.errorText}>{result.error}</pre></div>
                    ) : result.rows.length === 0 ? (
                      <div className={styles.emptyResults}>
                        <p className={styles.emptyTitle}>Извршено успешно</p>
                        <p className={styles.emptyHint}>Нема редови.</p>
                      </div>
                    ) : (
                      <div className={styles.tableWrap}>
                        <table className={styles.table}>
                          <thead><tr>{result.columns.map(c => <th key={c} className={styles.th}>{c}</th>)}</tr></thead>
                          <tbody>
                            {result.rows.map((row, i) => (
                              <tr key={i} className={styles.tr}>
                                {result.columns.map(c => (
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
                  Ова е теоретска задача ({CATEGORY_LABELS[task.category] ?? task.category}) — нема SQL за извршување.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
