import Link from "next/link";
import { PlayCircle } from "lucide-react";
import type { Task } from "@/types/database";
import styles from "./ContinuePracticing.module.css";

const CAT_LABELS: Record<string, string> = {
  dml: "DML", ddl: "DDL", trigger: "Trigger", er: "ER", relations: "Relations",
};

export default function ContinuePracticing({ task }: { task: Task }) {
  const stars = "★".repeat(task.difficulty) + "☆".repeat(5 - task.difficulty);

  return (
    <div className={styles.section}>
      <div className={styles.heading}>
        <PlayCircle size={18} strokeWidth={1.8} className={styles.headingIcon} />
        <span className={styles.headingText}>Continue Practicing</span>
      </div>

      <div className={styles.card}>
        <div className={styles.cardMeta}>
          <span className={`${styles.catBadge} ${styles[`cat_${task.category}`]}`}>
            {CAT_LABELS[task.category]}
          </span>
          <span className={styles.diff}>{stars}</span>
        </div>
        <p className={styles.title}>{task.title}</p>
        <p className={styles.prompt}>{task.prompt}</p>
        <div className={styles.cardFooter}>
          <span className={styles.pts}>{task.points} pts</span>
          <Link href={`/task/${task.id}`} className={styles.openBtn}>
            Open Task →
          </Link>
        </div>
      </div>
    </div>
  );
}
