import styles from "./loading.module.css";

export default function DashboardLoading() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.titleSkeleton} />
        <div className={styles.subSkeleton} />
      </div>
      <div className={styles.filterSkeleton} />
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.card} />
        ))}
      </div>
    </main>
  );
}
