import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Task, TaskCategory } from "@/types/database";
import DashboardFilters from "@/components/DashboardFilters";
import CategoryBrowser from "@/components/CategoryBrowser";
import ContinuePracticing from "@/components/ContinuePracticing";
import Leaderboard from "@/components/Leaderboard";
import styles from "./page.module.css";

interface PageProps {
  searchParams: { category?: string; difficulty?: string };
}

interface LeaderboardRow {
  rank: number;
  user_id: string;
  display_name: string | null;
  total_score: number;
  tasks_solved: number;
}

interface Submission {
  id: string;
  task_id: string;
  score: number;
  is_correct: boolean;
  created_at: string;
}

function calcStreak(submissions: Submission[]): number {
  if (!submissions.length) return 0;
  const days = Array.from(new Set(
    submissions.map((s) => new Date(s.created_at).toDateString())
  )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < days.length; i++) {
    const expected = new Date(today);
    expected.setDate(today.getDate() - i);
    if (days[i] === expected.toDateString()) streak++;
    else break;
  }
  return streak;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const displayName = user?.email?.split("@")[0] ?? "there";

  // All verified tasks
  const { data: allTasks } = await supabase
    .from("tasks").select("*").eq("verified", true);
  const tasks = (allTasks ?? []) as Task[];

  // User submissions
  const { data: subData } = await supabase
    .from("submissions")
    .select("id, task_id, score, is_correct, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });
  const submissions = (subData ?? []) as Submission[];

  // Stats
  const completedTaskIds = new Set(
    submissions.filter((s) => s.is_correct).map((s) => s.task_id)
  );
  const bestPerTask = new Map<string, number>();
  submissions.forEach((s) => {
    if (!bestPerTask.has(s.task_id) || bestPerTask.get(s.task_id)! < s.score) {
      bestPerTask.set(s.task_id, s.score);
    }
  });
  const totalScore = Math.round(Array.from(bestPerTask.values()).reduce((a, b) => a + b, 0));
  const streak = calcStreak(submissions);
  const totalTasks = tasks.length;
  const completedCount = completedTaskIds.size;

  // Category progress
  const CATS: { key: TaskCategory; label: string; desc: string }[] = [
    { key: "ddl",      label: "DDL (Data Definition)",    desc: "CREATE TABLE, primary keys, constraints" },
    { key: "dml",      label: "DML (Data Manipulation)",   desc: "SELECT, JOIN, GROUP BY, subqueries"      },
    { key: "trigger",  label: "Triggers",                  desc: "BEFORE/AFTER, PL/pgSQL, state testing"   },
    { key: "er",       label: "ER Diagrams",               desc: "Entities, relationships, cardinality"    },
  ];

  const catProgress = CATS.map((c) => {
    const catTasks = tasks.filter((t) => t.category === c.key);
    const catCompleted = catTasks.filter((t) => completedTaskIds.has(t.id)).length;
    return { ...c, total: catTasks.length, completed: catCompleted };
  });

  // Last attempted task (most recent submission)
  const lastTaskId = submissions[0]?.task_id ?? null;
  const lastTask = lastTaskId ? tasks.find((t) => t.id === lastTaskId) ?? null : null;

  // Filtered task list
  let filtered = [...tasks];
  if (searchParams.category) filtered = filtered.filter((t) => t.category === searchParams.category);
  if (searchParams.difficulty) filtered = filtered.filter((t) => t.difficulty === Number(searchParams.difficulty));
  filtered.sort((a, b) => a.difficulty - b.difficulty);

  // Leaderboard top 5
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: lbData } = await (supabase as any).rpc("get_leaderboard", { limit_n: 5 });
  const leaderboard = (lbData ?? []) as LeaderboardRow[];

  const showFiltered = !!(searchParams.category || searchParams.difficulty);

  return (
    <div className={styles.body}>
        {/* ── Main content ── */}
        <div className={styles.content}>

          {/* Welcome */}
          <div className={styles.welcomeCard}>
            <div>
              <h1 className={styles.welcomeTitle}>Welcome back, {displayName}!</h1>
              <p className={styles.welcomeSub}>Your daily SQL practice overview.</p>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Total Points</p>
              <p className={styles.statValue}>{totalScore.toLocaleString()}</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Active Streak</p>
              <p className={styles.statValue}>{streak} <span className={styles.statUnit}>day{streak !== 1 ? "s" : ""}</span></p>
              <p className={styles.statSub}>{streak > 0 ? "Keep it up!" : "Start today"}</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Completed Tasks</p>
              <p className={styles.statValue}>
                {completedCount}<span className={styles.statOf}>/{totalTasks}</span>
              </p>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${totalTasks ? (completedCount / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Continue practicing */}
          {lastTask && <ContinuePracticing task={lastTask} />}

          {/* Category browser */}
          <CategoryBrowser categories={catProgress} />

          {/* Task list when filters active */}
          {showFiltered && (
            <div className={styles.filteredSection}>
              <div className={styles.filteredHeader}>
                <h2 className={styles.filteredTitle}>Tasks</h2>
                <Suspense><DashboardFilters /></Suspense>
              </div>
              {filtered.length === 0 ? (
                <p className={styles.emptyText}>No tasks match these filters.</p>
              ) : (
                <div className={styles.grid}>
                  {filtered.map((task) => (
                    <Link key={task.id} href={`/task/${task.id}`} className={styles.taskRow}>
                      <div className={styles.taskRowLeft}>
                        <span className={`${styles.taskBadge} ${styles[`cat_${task.category}`]}`}>
                          {task.category.toUpperCase()}
                        </span>
                        <span className={styles.taskTitle}>{task.title}</span>
                      </div>
                      <div className={styles.taskRowRight}>
                        <span className={styles.taskStars}>{"★".repeat(task.difficulty)}{"☆".repeat(5 - task.difficulty)}</span>
                        <span className={styles.taskPts}>{task.points} pts</span>
                        <span className={styles.taskArrow}>→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── Right panel ── */}
        <aside className={styles.rightPanel}>
          <div className={styles.leaderboardSection}>
            <div className={styles.leaderboardHeader}>
              <h2 className={styles.leaderboardTitle}>Leaderboard</h2>
              <span className={styles.leaderboardTop}>Top 5</span>
            </div>
            <Leaderboard rows={leaderboard} currentUserId={user?.id ?? ""} />
            <Link href="/leaderboard" className={styles.fullListBtn}>
              Целосна листа
            </Link>
          </div>
        </aside>
    </div>
  );
}
