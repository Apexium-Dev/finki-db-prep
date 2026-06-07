"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Clock, CheckCircle2, Eye } from "lucide-react";
import type { Task } from "@/types/database";
import { useLanguage } from "./LanguageProvider";
import styles from "./CategoryPage.module.css";

export interface TaskWithMeta extends Task {
  completed: boolean;
  bestScore: number;
  entityCount?: number;
  relationshipCount?: number;
  hintsCount: number;
}


const SKIP_TAGS = new Set(["er", "ddl", "dml", "trigger", "entity", "attribute",
  "relationship", "m:n", "m-n", "select", "join", "insert", "update", "delete"]);

function domainTag(task: TaskWithMeta): string | null {
  return task.tags.find((t) => !SKIP_TAGS.has(t.toLowerCase())) ?? null;
}

const PER_PAGE = 9;

export default function CategoryTaskList({
  tasks,
  showERCounts = false,
}: {
  tasks: TaskWithMeta[];
  showERCounts?: boolean;
}) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "hard">("all");
  const [page, setPage] = useState(1);

  const visible = tasks.filter((task) => {
    const q = search.toLowerCase();
    return (
      (task.title.toLowerCase().includes(q) || task.prompt.toLowerCase().includes(q)) &&
      (filter === "all" || task.difficulty >= 3)
    );
  });

  const totalPages = Math.ceil(visible.length / PER_PAGE);
  const paginated = visible.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleSearch(val: string) { setSearch(val); setPage(1); }
  function handleFilter(val: "all" | "hard") { setFilter(val); setPage(1); }

  return (
    <div className={styles.listSection}>
      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>{t.category.availableTasks}</h2>
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <Search size={14} strokeWidth={1.8} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder={t.category.searchPlaceholder}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className={styles.filters}>
            <button className={`${styles.filterBtn} ${filter === "all" ? styles.filterActive : ""}`} onClick={() => handleFilter("all")}>{t.category.all}</button>
            <button className={`${styles.filterBtn} ${filter === "hard" ? styles.filterActive : ""}`} onClick={() => handleFilter("hard")}>{t.category.hard}</button>
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className={styles.empty}>{t.category.noResults}</p>
      ) : (
        <div className={styles.grid}>
          {paginated.map((task) => {
            const tag = domainTag(task);
            return (
              <div key={task.id} className={`${styles.card} ${task.completed ? styles.cardDone : ""}`}>
                <div className={styles.cardTop}>
                  <span className={styles.domainTag}>
                    {tag ?? t.category.difficulty[task.difficulty] ?? `Ниво ${task.difficulty}`}
                  </span>
                  {task.completed
                    ? <span className={styles.doneBadge}><CheckCircle2 size={13} strokeWidth={2} />{t.category.completedBadge}</span>
                    : <span className={styles.timeBadge}><Clock size={12} strokeWidth={1.8} />{task.difficulty * 15} {t.min}</span>
                  }
                </div>

                <h3 className={`${styles.cardTitle} ${task.completed ? styles.cardTitleDone : ""}`}>
                  {task.title}
                </h3>
                <p className={styles.cardDesc}>{task.prompt.split("\n")[0]}</p>

                <div className={styles.cardFooter}>
                  <div className={styles.counts}>
                    {showERCounts && (task.entityCount ?? 0) > 0 && <span>E:{task.entityCount}</span>}
                    {showERCounts && (task.relationshipCount ?? 0) > 0 && <span>R:{task.relationshipCount}</span>}
                    {!showERCounts && task.hintsCount > 0 && <span>{task.hintsCount} {t.hints}</span>}
                    <span className={styles.pts}>{task.points} {t.pts}</span>
                  </div>
                  {task.completed ? (
                    <Link href={`/task/${task.id}`} className={styles.reviewLink}>
                      <Eye size={13} strokeWidth={2} />{t.category.viewSolution}
                    </Link>
                  ) : (
                    <Link href={`/task/${task.id}`} className={styles.startLink}>{t.category.startLink}</Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
