import type { DdlGradingResult } from "@/lib/grading/ddl";
import styles from "./DdlResultPanel.module.css";

interface Props {
  result: DdlGradingResult;
  earnedScore: number;
  maxScore: number;
}

export default function DdlResultPanel({ result, earnedScore, maxScore }: Props) {
  const { passed, score, maxScore: aspectCount, aspects, error } = result;

  return (
    <div className={`${styles.panel} ${passed ? styles.pass : styles.partial}`}>
      <div className={styles.verdict}>
        <span className={styles.icon}>{passed ? "✓" : score > 0 ? "◑" : "✗"}</span>
        <div>
          <p className={styles.verdictText}>
            {passed ? "Точно!" : score > 0 ? "Делумно точно" : "Неточно"}
          </p>
          <p className={styles.score}>
            {earnedScore} / {maxScore} поени &nbsp;·&nbsp; {score}/{aspectCount} аспекти
          </p>
        </div>
      </div>

      {error && <pre className={styles.error}>{error}</pre>}

      <ul className={styles.aspectList}>
        {aspects.map((a, i) => (
          <li key={i} className={`${styles.aspect} ${a.passed ? styles.aspectPass : styles.aspectFail}`}>
            <span className={styles.aspectIcon}>{a.passed ? "✓" : "✗"}</span>
            <div>
              <span className={styles.aspectLabel}>{a.label}</span>
              {a.detail && <span className={styles.aspectDetail}>{a.detail}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
