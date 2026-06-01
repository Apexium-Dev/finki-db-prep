import Link from "next/link";
import type { Task } from "@/types/database";
import styles from "./TaskCard.module.css";

const CATEGORY_LABELS: Record<string, string> = {
  dml: "DML",
  ddl: "DDL",
  trigger: "Тригер",
  er: "ER дијаграм",
  relations: "Релации",
};

const CATEGORY_COLORS: Record<string, string> = {
  dml: "blue",
  ddl: "green",
  trigger: "orange",
  er: "purple",
  relations: "pink",
};

export default function TaskCard({ task }: { task: Task }) {
  const stars = "★".repeat(task.difficulty) + "☆".repeat(5 - task.difficulty);
  const color = CATEGORY_COLORS[task.category] ?? "blue";

  return (
    <Link href={`/task/${task.id}`} className={styles.card}>
      <div className={styles.top}>
        <span className={`${styles.badge} ${styles[color]}`}>
          {CATEGORY_LABELS[task.category]}
        </span>
        <span className={styles.stars} title={`Тежина: ${task.difficulty}/5`}>
          {stars}
        </span>
      </div>
      <h3 className={styles.title}>{task.title}</h3>
      <p className={styles.prompt}>{task.prompt}</p>
      <div className={styles.footer}>
        <span className={styles.points}>{task.points} поени</span>
        <span className={styles.arrow}>→</span>
      </div>
    </Link>
  );
}
