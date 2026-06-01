import type { ErGradingResult } from "@/lib/grading/er";
import styles from "./ErResultPanel.module.css";

interface Props {
  result: ErGradingResult;
  earnedScore: number;
  maxScore: number;
}

export default function ErResultPanel({ result, earnedScore, maxScore }: Props) {
  const { passed, score, maxScore: aspectCount, aspects } = result;

  return (
    <div className={`${styles.panel} ${passed ? styles.pass : score > 0 ? styles.partial : styles.fail}`}>
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

      <ul className={styles.list}>
        {aspects.map((a, i) => (
          <li key={i} className={`${styles.item} ${a.passed ? styles.pass : styles.fail}`}>
            <span className={styles.icon2}>{a.passed ? "✓" : "✗"}</span>
            <div>
              <span className={styles.label}>{a.label}</span>
              {a.detail && <span className={styles.detail}>{a.detail}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
