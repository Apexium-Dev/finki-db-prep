import Link from "next/link";
import styles from "./not-found.module.css";

export default function TaskNotFound() {
  return (
    <div className={styles.page}>
      <span className={styles.icon}>🔍</span>
      <h1 className={styles.title}>Задачата не е пронајдена</h1>
      <p className={styles.sub}>
        Оваа задача не постои или е отстранета.
      </p>
      <Link href="/dashboard" className={styles.btn}>
        ← Назад кон задачите
      </Link>
    </div>
  );
}
