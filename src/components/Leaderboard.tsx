import styles from "./Leaderboard.module.css";

interface LeaderboardRow {
  rank: number;
  user_id: string;
  display_name: string | null;
  total_score: number;
  tasks_solved: number;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className={`${styles.rankBadge} ${styles.rank1}`}>1</span>;
  if (rank === 2) return <span className={`${styles.rankBadge} ${styles.rank2}`}>2</span>;
  if (rank === 3) return <span className={`${styles.rankBadge} ${styles.rank3}`}>3</span>;
  return <span className={styles.rankNum}>{rank}</span>;
}

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
        <p>No submissions yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className={styles.table}>
      <div className={styles.headerRow}>
        <span className={styles.colRank}>#</span>
        <span className={styles.colName}>User</span>
        <span className={styles.colScore}>Pts</span>
      </div>

      {rows.map((row) => {
        const isMe = row.user_id === currentUserId;
        return (
          <div key={row.user_id} className={`${styles.row} ${isMe ? styles.myRow : ""}`}>
            <span className={styles.colRank}>
              <RankBadge rank={row.rank} />
            </span>
            <span className={styles.colName}>
              {row.display_name ?? "Anonymous"}
              {isMe && <span className={styles.meBadge}>you</span>}
            </span>
            <span className={styles.colScore}>{Number(row.total_score).toFixed(0)}</span>
          </div>
        );
      })}
    </div>
  );
}
