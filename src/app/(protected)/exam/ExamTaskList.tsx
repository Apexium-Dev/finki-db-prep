"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, CheckCircle2, Clock } from "lucide-react";
import type { ExamTask } from "./page";
import styles from "./page.module.css";

export default function ExamTaskList({
  tasks,
  categoryLabels,
}: {
  tasks: ExamTask[];
  categoryLabels: Record<string, string>;
}) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");

  const visible = tasks.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = t.title.toLowerCase().includes(q) || t.prompt.toLowerCase().includes(q);
    const matchCat = cat === "all" || t.category === cat;
    return matchSearch && matchCat;
  });

  const availableCats = Array.from(new Set(tasks.map((t) => t.category))).sort();

  return (
    <div className={styles.listSection}>
      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>Задачи ({visible.length})</h2>
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <Search size={14} strokeWidth={1.8} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Пребарај задачи..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.filters}>
            <button
              className={`${styles.filterBtn} ${cat === "all" ? styles.filterActive : ""}`}
              onClick={() => setCat("all")}
            >
              Сите
            </button>
            {availableCats.map((c) => (
              <button
                key={c}
                className={`${styles.filterBtn} ${cat === c ? styles.filterActive : ""}`}
                onClick={() => setCat(c)}
              >
                {categoryLabels[c] ?? c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className={styles.empty}>Нема задачи.</p>
      ) : (
        <div className={styles.grid}>
          {visible.map((task) => (
            <div key={task.id} className={`${styles.card} ${task.completed ? styles.cardDone : ""}`}>
              <div className={styles.cardTop}>
                <span className={styles.domainTag}>
                  {categoryLabels[task.category] ?? task.category}
                </span>
                {task.completed ? (
                  <span className={styles.doneBadge}>
                    <CheckCircle2 size={13} strokeWidth={2} /> Решено
                  </span>
                ) : (
                  <span className={styles.timeBadge}>
                    <Clock size={12} strokeWidth={1.8} /> {task.difficulty * 15} мин
                  </span>
                )}
              </div>
              <h3 className={`${styles.cardTitle} ${task.completed ? styles.cardTitleDone : ""}`}>
                {task.title}
              </h3>
              <p className={styles.cardDesc}>{task.prompt.split("\n")[0].slice(0, 120)}</p>
              <div className={styles.cardFooter}>
                <span className={styles.pts}>{task.points} поени</span>
                <Link href={`/task/${task.id}`} className={task.completed ? styles.reviewLink : styles.startLink}>
                  {task.completed ? "Прегледај" : "Реши"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
