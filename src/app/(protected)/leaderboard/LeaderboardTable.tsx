"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { getLevel } from "@/lib/levels";
import type { LeaderboardRow } from "./page";
import styles from "./page.module.css";

function RankDisplay({ rank }: { rank: number }) {
  if (rank === 1) return <span className={`${styles.rankBadge} ${styles.rank1}`}>1</span>;
  if (rank === 2) return <span className={`${styles.rankBadge} ${styles.rank2}`}>2</span>;
  if (rank === 3) return <span className={`${styles.rankBadge} ${styles.rank3}`}>3</span>;
  return <span className={styles.rankNum}>{rank}</span>;
}

export default function LeaderboardTable({
  rows,
  currentUserId,
}: {
  rows: LeaderboardRow[];
  currentUserId: string;
}) {
  const [search, setSearch] = useState("");

  const filtered = rows.filter((r) =>
    (r.display_name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.tableSection}>
      {/* Search */}
      <div className={styles.searchWrap}>
        <Search size={15} strokeWidth={1.8} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Пребарај корисник..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className={styles.totalCount}>{filtered.length} корисници</span>
      </div>

      {/* Table */}
      <div className={styles.table}>
        {/* Header */}
        <div className={styles.tableHead}>
          <span className={styles.colRank}>#</span>
          <span className={styles.colUser}>Корисник</span>
          <span className={styles.colLevel}>Ниво</span>
          <span className={styles.colTasks}>Задачи</span>
          <span className={styles.colScore}>Поени</span>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>Нема резултати за пребарувањето.</div>
        ) : (
          filtered.map((row) => {
            const isMe = row.user_id === currentUserId;
            const lvl  = getLevel(Number(row.total_score));
            return (
              <div key={row.user_id} className={`${styles.tableRow} ${isMe ? styles.myRow : ""}`}>
                <span className={styles.colRank}>
                  <RankDisplay rank={row.rank} />
                </span>

                <span className={styles.colUser}>
                  <span className={styles.avatar}>
                    {(row.display_name ?? "?")[0].toUpperCase()}
                  </span>
                  <span className={styles.userName}>
                    {row.display_name ?? "Анонимен"}
                  </span>
                  {isMe && <span className={styles.meBadge}>ти</span>}
                </span>

                <span className={styles.colLevel}>
                  <span className={styles.levelChip}>
                    <span className={styles.levelNum}>{lvl.level}</span>
                    <span className={styles.levelTitle}>{lvl.title}</span>
                  </span>
                </span>

                <span className={styles.colTasks}>{row.tasks_solved}</span>

                <span className={styles.colScore}>
                  {Math.round(Number(row.total_score)).toLocaleString()}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
