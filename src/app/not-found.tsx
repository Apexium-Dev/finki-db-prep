import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Страницата не е пронајдена</h1>
      <p className={styles.sub}>Линкот не постои или е преместен.</p>
      <Link href="/" className={styles.btn}>← Почетна страница</Link>
    </div>
  );
}
