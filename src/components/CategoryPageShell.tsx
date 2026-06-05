import CategoryTaskList from "./CategoryTaskList";
import type { TaskWithMeta } from "./CategoryTaskList";
import { getT } from "@/lib/i18n/server";
import styles from "./CategoryPage.module.css";

interface Props {
  title: string;
  subtitle: string;
  totalCount: number;
  completedCount: number;
  avgDiff: number;
  tasks: TaskWithMeta[];
  showERCounts?: boolean;
}

export default async function CategoryPageShell({
  title, subtitle, totalCount, completedCount, avgDiff, tasks, showERCounts = false,
}: Props) {
  const t = getT();
  const diffLabel = t.category.difficulty[avgDiff] ?? (avgDiff > 0 ? `Ниво ${avgDiff}` : "—");

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
            </svg>
          </div>
          <p className={styles.statValue}>{totalCount}</p>
          <p className={styles.statLabel}>{t.category.activeTasks}</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <p className={styles.statValue}>{completedCount}</p>
          <p className={styles.statLabel}>{t.category.completed}</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
            </svg>
          </div>
          <p className={styles.statValue}>{diffLabel}</p>
          <p className={styles.statLabel}>{t.category.currentDifficulty}</p>
        </div>
      </div>

      <CategoryTaskList tasks={tasks} showERCounts={showERCounts} />
    </div>
  );
}
