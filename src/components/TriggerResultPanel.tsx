import type { TriggerGradingResult } from "@/lib/grading/trigger";
import styles from "./TriggerResultPanel.module.css";

interface Props {
  result: TriggerGradingResult;
  earnedScore: number;
  maxScore: number;
}

export default function TriggerResultPanel({ result, earnedScore, maxScore }: Props) {
  const { passed, score, maxScore: scenarioCount, scenarios, error } = result;

  return (
    <div className={`${styles.panel} ${passed ? styles.pass : score > 0 ? styles.partial : styles.fail}`}>
      <div className={styles.verdict}>
        <span className={styles.icon}>{passed ? "✓" : score > 0 ? "◑" : "✗"}</span>
        <div>
          <p className={styles.verdictText}>
            {passed ? "Точно!" : score > 0 ? "Делумно точно" : "Неточно"}
          </p>
          <p className={styles.score}>
            {earnedScore} / {maxScore} поени{scenarioCount > 0 && <> &nbsp;·&nbsp; {score}/{scenarioCount} сценарија</>}
          </p>
        </div>
      </div>

      {error && <pre className={styles.error}>{error}</pre>}

      {scenarios.length > 0 && (
        <ul className={styles.list}>
          {scenarios.map((s, i) => (
            <li key={i} className={`${styles.item} ${s.passed ? styles.itemPass : styles.itemFail}`}>
              <span className={styles.itemIcon}>{s.passed ? "✓" : "✗"}</span>
              <div>
                <span className={styles.itemDesc}>{s.description}</span>
                {s.detail && <span className={styles.itemDetail}>{s.detail}</span>}
                {s.raised && !s.passed && (
                  <span className={styles.itemDetail}>Тригерот фрли грешка кога не треба</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
