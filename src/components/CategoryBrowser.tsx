import Link from "next/link";
import { Database, Table2, Zap, GitBranch, LayoutList } from "lucide-react";
import type { TaskCategory } from "@/types/database";
import styles from "./CategoryBrowser.module.css";

interface CategoryItem {
  key: TaskCategory;
  label: string;
  desc: string;
  total: number;
  completed: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICONS: Record<string, React.ComponentType<any>> = {
  ddl:     Database,
  dml:     Table2,
  trigger: Zap,
  er:      GitBranch,
};

export default function CategoryBrowser({ categories }: { categories: CategoryItem[] }) {
  return (
    <div className={styles.section}>
      <div className={styles.heading}>
        <LayoutList size={18} strokeWidth={1.8} className={styles.headingIcon} />
        <span className={styles.headingText}>Category Browser</span>
      </div>

      <div className={styles.grid}>
        {categories.map((c) => {
          const Icon = ICONS[c.key] ?? Database;
          const pct = c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0;

          return (
            <Link
              key={c.key}
              href={`/dashboard?category=${c.key}`}
              className={styles.card}
            >
              <div className={styles.cardTop}>
                <div className={styles.iconWrap}>
                  <Icon size={18} strokeWidth={1.8} className={styles.icon} />
                </div>
                <span className={styles.progress}>{c.completed}/{c.total}</span>
              </div>
              <h3 className={styles.label}>{c.label}</h3>
              <p className={styles.desc}>{c.desc}</p>
              <div className={styles.bar}>
                <div className={styles.barFill} style={{ width: `${pct}%` }} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
