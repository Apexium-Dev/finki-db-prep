"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { BarChart2 } from "lucide-react";
import { markReviewed } from "./actions";
import styles from "./page.module.css";

export interface FeedbackRow {
  id: string;
  type: "bug" | "suggestion";
  message: string;
  status: "new" | "reviewed";
  created_at: string;
  display_name: string;
  task_title: string | null;
  task_id: string | null;
}

export default function AdminPanel({ rows }: { rows: FeedbackRow[] }) {
  const [filter, setFilter] = useState<"all" | "new" | "bug" | "suggestion">("all");
  const [items, setItems] = useState<FeedbackRow[]>(rows);
  const [, startTransition] = useTransition();

  const visible = items.filter((r) => {
    if (filter === "new") return r.status === "new";
    if (filter === "bug") return r.type === "bug";
    if (filter === "suggestion") return r.type === "suggestion";
    return true;
  });

  const newCount = items.filter((r) => r.status === "new").length;

  function handleReview(id: string) {
    setItems((prev) => prev.map((r) => r.id === id ? { ...r, status: "reviewed" } : r));
    startTransition(() => markReviewed(id));
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin — Повратна информација</h1>
          <p className={styles.subtitle}>{newCount} нови пораки · {items.length} вкупно</p>
        </div>
        <Link href="/admin/analytics" className={styles.analyticsLink}>
          <BarChart2 size={15} strokeWidth={1.8} />
          Аналитика
        </Link>
      </div>

      <div className={styles.filters}>
        {(["all", "new", "bug", "suggestion"] as const).map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "Сите" : f === "new" ? "Нови" : f === "bug" ? "Проблеми" : "Сугестии"}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className={styles.empty}>Нема пораки.</p>
      ) : (
        <div className={styles.list}>
          {visible.map((row) => (
            <div key={row.id} className={`${styles.card} ${row.status === "new" ? styles.cardNew : styles.cardReviewed}`}>
              <div className={styles.cardTop}>
                <div className={styles.cardMeta}>
                  <span className={`${styles.typeBadge} ${row.type === "bug" ? styles.typeBug : styles.typeSuggestion}`}>
                    {row.type === "bug" ? "Грешка" : "Сугестија"}
                  </span>
                  {row.task_title && (
                    <Link href={`/task/${row.task_id}`} className={styles.taskLink}>
                      {row.task_title}
                    </Link>
                  )}
                  <span className={styles.user}>{row.display_name}</span>
                  <span className={styles.date}>{new Date(row.created_at).toLocaleString("mk-MK")}</span>
                </div>
                {row.status === "new" ? (
                  <button className={styles.reviewBtn} onClick={() => handleReview(row.id)}>
                    Означи прегледано
                  </button>
                ) : (
                  <span className={styles.reviewedBadge}>Прегледано</span>
                )}
              </div>
              <p className={styles.message}>{row.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
