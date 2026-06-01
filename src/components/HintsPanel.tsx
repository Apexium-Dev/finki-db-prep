"use client";

import type { HintItem } from "@/types/database";
import styles from "./HintsPanel.module.css";

interface HintsPanelProps {
  hints: HintItem[];
  revealed: number;
  totalPenalty: number;
  onReveal: () => void;
  submitted: boolean;
  inline?: boolean; // render without outer card border (used inside a tab)
}

export default function HintsPanel({
  hints,
  revealed,
  totalPenalty,
  onReveal,
  submitted,
  inline = false,
}: HintsPanelProps) {
  if (!hints || hints.length === 0) return null;

  const next = hints[revealed];
  const canReveal = revealed < hints.length;

  const content = (
    <>
      {totalPenalty > 0 && (
        <p className={styles.penaltyNote}>
          Досега одземено: <strong>−{totalPenalty}%</strong> од максималниот резултат
        </p>
      )}

      {revealed === 0 && (
        <p className={styles.intro}>
          Секој совет го намалува максималниот резултат. Обиди се сам прво!
        </p>
      )}

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
          <span>Прикажи совет {revealed + 1}</span>
          <span className={styles.cost}>−{next.score_penalty}% поени</span>
        </button>
      )}

      {!canReveal && (
        <p className={styles.exhausted}>Сите совети се прикажани.</p>
      )}

      {submitted && canReveal && (
        <p className={styles.locked}>Поднесено — советите се заклучени.</p>
      )}
    </>
  );

  if (inline) return <div className={styles.inline}>{content}</div>;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>💡 Совети</span>
        {totalPenalty > 0 && (
          <span className={styles.penaltyBadge}>−{totalPenalty}%</span>
        )}
      </div>
      <div className={styles.body}>{content}</div>
    </div>
  );
}
