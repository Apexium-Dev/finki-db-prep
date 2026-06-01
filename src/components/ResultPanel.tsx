import type { GradingResult } from "@/lib/grading/dml";
import styles from "./ResultPanel.module.css";

interface ResultPanelProps {
  result: GradingResult;
  earnedScore: number;
  maxScore: number;
}

export default function ResultPanel({ result, earnedScore, maxScore }: ResultPanelProps) {
  const { passed, studentRows, referenceRows, error, columns } = result;

  return (
    <div className={`${styles.panel} ${passed ? styles.pass : styles.fail}`}>
      <div className={styles.verdict}>
        <span className={styles.icon}>{passed ? "✓" : "✗"}</span>
        <div>
          <p className={styles.verdictText}>
            {passed ? "Точно!" : error ? "Грешка во SQL" : "Неточно"}
          </p>
          <p className={styles.score}>
            {earnedScore} / {maxScore} поени
          </p>
        </div>
      </div>

      {error && (
        <pre className={styles.error}>{error}</pre>
      )}

      {!error && (
        <div className={styles.tables}>
          <ResultTable label="Твој резултат" rows={studentRows} columns={columns} />
          {!passed && (
            <ResultTable label="Очекуван резултат" rows={referenceRows} columns={columns} />
          )}
        </div>
      )}
    </div>
  );
}

function ResultTable({
  label,
  rows,
  columns,
}: {
  label: string;
  rows: Record<string, unknown>[];
  columns: string[];
}) {
  return (
    <div className={styles.tableWrapper}>
      <p className={styles.tableLabel}>{label}</p>
      {rows.length === 0 ? (
        <p className={styles.empty}>Нема резултати</p>
      ) : (
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {columns.map((c) => (
                    <td key={c}>{String(row[c] ?? "")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
