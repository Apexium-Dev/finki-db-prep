import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Task, TaskCategory } from "@/types/database";
import TaskCard from "@/components/TaskCard";
import DashboardFilters from "@/components/DashboardFilters";
import styles from "./page.module.css";

interface PageProps {
  searchParams: { category?: string; difficulty?: string };
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const supabase = createClient();

  const baseQuery = supabase
    .from("tasks")
    .select("*")
    .eq("verified", true)
    .order("difficulty", { ascending: true });

  const withCategory = searchParams.category
    ? baseQuery.eq("category", searchParams.category as TaskCategory)
    : baseQuery;

  const withDifficulty = searchParams.difficulty
    ? withCategory.eq("difficulty", Number(searchParams.difficulty))
    : withCategory;

  const { data, error } = await withDifficulty;
  const tasks = data as Task[] | null;

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Задачи</h1>
        <p className={styles.sub}>
          Избери задача и започни да вежбаш. Тешките задачи носат повеќе поени.
        </p>
      </div>

      <Suspense>
        <DashboardFilters />
      </Suspense>

      {error && (
        <p className={styles.error}>Грешка при вчитување на задачите.</p>
      )}

      {!error && tasks && tasks.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📭</span>
          <p className={styles.emptyText}>
            Нема задачи за избраните филтри.
          </p>
          <p className={styles.emptySub}>
            Обиди се со друга категорија или тежина.
          </p>
        </div>
      )}

      {!error && tasks && tasks.length > 0 && (
        <div className={styles.grid}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </main>
  );
}
