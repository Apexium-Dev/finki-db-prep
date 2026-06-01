import styles from "./Leaderboard.module.css";

interface LeaderboardRow {
  rank: number;
  user_id: string;
  display_name: string | null;
  total_score: number;
  tasks_solved: number;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard({
  rows,
  currentUserId,
}: {
  rows: LeaderboardRow[];
  currentUserId: string;
}) {
  if (rows.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Сè уште нема поднесени решенија. Биди првиот!</p>
      </div>
    );
  }

  return (
    <div className={styles.table}>
      <div className={styles.headerRow}>
        <span className={styles.colRank}>#</span>
        <span className={styles.colName}>Корисник</span>
        <span className={styles.colTasks}>Задачи</span>
        <span className={styles.colScore}>Поени</span>
      </div>

      {rows.map((row) => {
        const isMe = row.user_id === currentUserId;
        const medal = MEDALS[row.rank - 1];
        return (
          <div
            key={row.user_id}
            className={`${styles.row} ${isMe ? styles.myRow : ""}`}
          >
            <span className={styles.colRank}>
              {medal ?? <span className={styles.rankNum}>{row.rank}</span>}
            </span>
            <span className={styles.colName}>
              {row.display_name ?? "Анонимен"}
              {isMe && <span className={styles.meBadge}>ти</span>}
            </span>
            <span className={styles.colTasks}>{Number(row.tasks_solved)}</span>
            <span className={styles.colScore}>{Number(row.total_score).toFixed(0)}</span>
          </div>
        );
      })}
    </div>
  );
}
