"use client";

import type { HintItem } from "@/types/database";
import styles from "./HintsPanel.module.css";

interface HintsPanelProps {
  hints: HintItem[];
  revealed: number;
  totalPenalty: number;
  onReveal: () => void;
  submitted: boolean;
}

export default function HintsPanel({
  hints,
  revealed,
  totalPenalty,
  onReveal,
  submitted,
}: HintsPanelProps) {
  if (!hints || hints.length === 0) return null;

  const next = hints[revealed];
  const canReveal = revealed < hints.length;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>💡 Совети</span>
        {totalPenalty > 0 && (
          <span className={styles.penalty}>−{totalPenalty}% поени</span>
        )}
      </div>

      {revealed > 0 && (
        <ul className={styles.list}>
          {hints.slice(0, revealed).map((h, i) => (
            <li key={i} className={styles.hint}>
              <span className={styles.level}>Совет {i + 1}</span>
              <p className={styles.text}>{h.text}</p>
            </li>
          ))}
        </ul>
      )}

      {canReveal && !submitted && (
        <button className={styles.revealBtn} onClick={onReveal}>
          Прикажи совет {revealed + 1}
          <span className={styles.cost}>−{next.score_penalty}%</span>
        </button>
      )}

      {!canReveal && (
        <p className={styles.exhausted}>Сите совети се прикажани.</p>
      )}
    </div>
  );
}
