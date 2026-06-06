import { createClient } from "@/lib/supabase/server";
import { createProfessorClient } from "@/lib/supabase/professor";
import ExamTaskList from "./ExamTaskList";
import styles from "./page.module.css";

const CATEGORY_LABELS: Record<string, string> = {
  dml: "DML",
  ddl: "DDL",
  er: "ER Дијаграм",
  relations: "Релациска Шема",
  trigger: "Тригери",
};

export interface ExamTask {
  id: string;
  category: string;
  difficulty: number;
  title: string;
  prompt: string;
  setup_sql: string | null;
  points: number;
  completed: boolean;
}

export default async function ExamPage() {
  const supabase = createClient();
  const prof = createProfessorClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all exam tasks from professor DB
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tasks } = await (prof as any)
    .from("tasks")
    .select("id, category, difficulty, title, prompt, setup_sql, points")
    .order("category")
    .order("difficulty");

  // Fetch user's completed task IDs from our DB
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: submissions } = await (supabase as any)
    .from("submissions")
    .select("task_id")
    .eq("user_id", user!.id)
    .eq("is_correct", true);

  const completedIds = new Set((submissions ?? []).map((s: { task_id: string }) => s.task_id));

  const enriched: ExamTask[] = (tasks ?? []).map((t: Omit<ExamTask, "completed">) => ({
    ...t,
    completed: completedIds.has(t.id),
  }));

  const totalCount = enriched.length;
  const completedCount = enriched.filter((t) => t.completed).length;
  const categories = Array.from(new Set(enriched.map((t) => t.category))).sort();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Стари Испити</h1>
        <p className={styles.subtitle}>
          Задачи од испитите по Бази на Податоци 1 — вежбај со реални прашања.
        </p>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <p className={styles.statValue}>{totalCount}</p>
          <p className={styles.statLabel}>Задачи</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statValue}>{completedCount}</p>
          <p className={styles.statLabel}>Решени</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statValue}>{categories.length}</p>
          <p className={styles.statLabel}>Категории</p>
        </div>
      </div>

      <ExamTaskList tasks={enriched} categoryLabels={CATEGORY_LABELS} />
    </div>
  );
}
