import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import styles from "./page.module.css";

export default function StariIspitPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <Clock size={36} strokeWidth={1.4} className={styles.icon} />
        </div>
        <h1 className={styles.title}>Стари испити</h1>
        <p className={styles.sub}>
          Оваа секција е во изработка. Наскоро ќе можете да вежбате со задачи
          од реални испити одржани на ФИНКИ.
        </p>
        <Link href="/dashboard" className={styles.back}>
          <ArrowLeft size={15} strokeWidth={2} />
          Назад на Dashboard
        </Link>
      </div>
    </div>
  );
}
