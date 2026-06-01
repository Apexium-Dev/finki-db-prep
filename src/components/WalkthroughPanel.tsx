"use client";

import { useState } from "react";
import type { WalkthroughStep } from "@/types/database";
import styles from "./WalkthroughPanel.module.css";

interface WalkthroughPanelProps {
  steps: WalkthroughStep[];
}

export default function WalkthroughPanel({ steps }: WalkthroughPanelProps) {
  const [revealed, setRevealed] = useState(1);

  if (!steps || steps.length === 0) return null;

  const visible = steps.slice(0, revealed);
  const hasMore = revealed < steps.length;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>📋 Упатство за решавање</span>
        <span className={styles.progress}>{revealed}/{steps.length}</span>
      </div>

      <ol className={styles.list}>
        {visible.map((s, i) => (
          <li key={i} className={styles.step}>
            <span className={styles.stepNum}>{s.step}</span>
            <p className={styles.stepText}>{s.explanation}</p>
          </li>
        ))}
      </ol>

      {hasMore ? (
        <button
          className={styles.nextBtn}
          onClick={() => setRevealed((r) => r + 1)}
        >
          Следен чекор →
        </button>
      ) : (
        <p className={styles.done}>Упатството е комплетно.</p>
      )}
    </div>
  );
}
