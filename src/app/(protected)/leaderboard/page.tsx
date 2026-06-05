import { createClient } from "@/lib/supabase/server";
import { getLevel } from "@/lib/levels";
import LeaderboardTable from "./LeaderboardTable";
import styles from "./page.module.css";

export interface LeaderboardRow {
  rank: number;
  user_id: string;
  display_name: string | null;
  total_score: number;
  tasks_solved: number;
}

export default async function LeaderboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any).rpc("get_leaderboard", { limit_n: 100 });
  const rows = (data ?? []) as LeaderboardRow[];

  const myRow = rows.find((r) => r.user_id === user!.id) ?? null;
  const myLevel = myRow ? getLevel(Number(myRow.total_score)) : null;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Ранг Листа</h1>
          <p className={styles.subtitle}>Топ студенти според вкупно освоени поени.</p>
        </div>

        {/* Current user card */}
        {myRow && myLevel && (
          <div className={styles.myCard}>
            <div className={styles.myRankWrap}>
              <span className={styles.myRankLabel}>Твое место</span>
              <span className={styles.myRank}>#{myRow.rank}</span>
            </div>
            <div className={styles.myDivider} />
            <div className={styles.myStats}>
              <div className={styles.myStat}>
                <span className={styles.myStatVal}>{Math.round(Number(myRow.total_score)).toLocaleString()}</span>
                <span className={styles.myStatLabel}>поени</span>
              </div>
              <div className={styles.myStat}>
                <span className={styles.myStatVal}>{myRow.tasks_solved}</span>
                <span className={styles.myStatLabel}>задачи</span>
              </div>
              <div className={styles.myStat}>
                <span className={styles.myStatVal}>{myLevel.level}</span>
                <span className={styles.myStatLabel}>{myLevel.title}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <LeaderboardTable rows={rows} currentUserId={user!.id} />
    </div>
  );
}
