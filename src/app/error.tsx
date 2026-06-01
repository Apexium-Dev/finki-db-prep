"use client";

import { useEffect } from "react";
import styles from "./not-found.module.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.page}>
      <span className={styles.code}>500</span>
      <h1 className={styles.title}>Нешто тргна наопаку</h1>
      <p className={styles.sub}>Се случи неочекувана грешка. Обиди се повторно.</p>
      <button
        onClick={reset}
        style={{
          display: "inline-block",
          background: "#3b82f6",
          color: "#fff",
          fontWeight: 600,
          fontSize: "0.9rem",
          padding: "0.65rem 1.5rem",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Обиди се повторно
      </button>
    </div>
  );
}
