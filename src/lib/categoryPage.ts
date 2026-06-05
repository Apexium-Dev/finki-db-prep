import { createClient } from "@/lib/supabase/server";
import type { Task, TaskCategory } from "@/types/database";
import type { TaskWithMeta } from "@/components/CategoryTaskList";

interface Submission { task_id: string; is_correct: boolean; score: number; }

function parseERCounts(ref: string) {
  try {
    const p = JSON.parse(ref);
    return { entityCount: p.entities?.length ?? 0, relationshipCount: p.relationships?.length ?? 0 };
  } catch { return { entityCount: 0, relationshipCount: 0 }; }
}

export async function fetchCategoryPageData(category: TaskCategory) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: taskData } = await supabase
    .from("tasks").select("*")
    .eq("category", category).eq("verified", true)
    .order("difficulty", { ascending: true });
  const tasks = (taskData ?? []) as Task[];

  const { data: subData } = await supabase
    .from("submissions").select("task_id, is_correct, score")
    .eq("user_id", user!.id);
  const subs = (subData ?? []) as Submission[];

  const bestPerTask = new Map<string, number>();
  const correctIds  = new Set<string>();
  subs.forEach((s) => {
    if (s.is_correct) correctIds.add(s.task_id);
    if (!bestPerTask.has(s.task_id) || bestPerTask.get(s.task_id)! < s.score)
      bestPerTask.set(s.task_id, s.score);
  });

  const enriched: TaskWithMeta[] = tasks.map((t) => ({
    ...t,
    ...(category === "er" ? parseERCounts(t.reference_solution) : {}),
    hintsCount: Array.isArray(t.hints) ? t.hints.length : 0,
    completed: correctIds.has(t.id),
    bestScore: bestPerTask.get(t.id) ?? 0,
  }));

  const completedCount = enriched.filter((t) => t.completed).length;
  const remaining      = enriched.filter((t) => !t.completed);
  const avgDiff        = remaining.length
    ? Math.round(remaining.reduce((s, t) => s + t.difficulty, 0) / remaining.length) : 0;

  return { enriched, totalCount: enriched.length, completedCount, avgDiff };
}

export const DIFF_LABEL: Record<number, string> = {
  1: "Лесна", 2: "Средна", 3: "Тешка", 4: "Напредна", 5: "Eкспертска",
};
