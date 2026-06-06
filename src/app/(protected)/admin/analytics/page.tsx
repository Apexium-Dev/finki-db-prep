import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AnalyticsDashboard from "./AnalyticsDashboard";

const ADMIN_IDS = new Set([
  "81a572ca-2617-4f74-be71-96f61476593f",
  "0a642287-f1c0-40fd-97fc-ff511f70c0db",
]);

export default async function AnalyticsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_IDS.has(user.id)) redirect("/dashboard");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  // Summary counts
  const { data: allSubs } = await db
    .from("submissions")
    .select("id, user_id, is_correct, task_id, created_at, score");

  const { count: taskCount } = await db
    .from("tasks")
    .select("id", { count: "exact", head: true });

  const subs: {
    id: string; user_id: string; is_correct: boolean;
    task_id: string; created_at: string; score: number;
  }[] = allSubs ?? [];

  const totalStudents = new Set(subs.map((s) => s.user_id)).size;
  const totalSubmissions = subs.length;
  const correctCount = subs.filter((s) => s.is_correct).length;
  const correctRate = totalSubmissions > 0
    ? Math.round((correctCount / totalSubmissions) * 100)
    : 0;

  // Raw timestamps for client-side time aggregation (date + hour)
  const rawTimestamps = subs.map((s) => ({
    date: s.created_at.slice(0, 10),
    hour: s.created_at.slice(11, 13),
    is_correct: s.is_correct,
  }));

  // Correct vs incorrect pie
  const pieData = [
    { name: "Точни", value: correctCount },
    { name: "Неточни", value: totalSubmissions - correctCount },
  ];

  // Task stats — fetch titles + categories
  const { data: tasks } = await db.from("tasks").select("id, title, category");
  const taskMeta: Record<string, { title: string; category: string }> = {};
  for (const t of tasks ?? []) taskMeta[t.id] = { title: t.title, category: t.category };

  const taskStats: Record<string, { total: number; correct: number }> = {};
  for (const s of subs) {
    if (!taskStats[s.task_id]) taskStats[s.task_id] = { total: 0, correct: 0 };
    taskStats[s.task_id].total++;
    if (s.is_correct) taskStats[s.task_id].correct++;
  }

  // Top 10 hardest (min 5 attempts, lowest correct rate)
  const hardest = Object.entries(taskStats)
    .filter(([, v]) => v.total >= 5)
    .map(([id, v]) => ({
      title: taskMeta[id]?.title ?? id,
      rate: Math.round((v.correct / v.total) * 100),
      total: v.total,
    }))
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 10);

  // Top 10 most attempted
  const mostAttempted = Object.entries(taskStats)
    .map(([id, v]) => ({
      title: taskMeta[id]?.title ?? id,
      total: v.total,
      correct: v.correct,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Submissions by category
  const catMap: Record<string, { total: number; correct: number }> = {};
  for (const s of subs) {
    const cat = taskMeta[s.task_id]?.category ?? "unknown";
    if (!catMap[cat]) catMap[cat] = { total: 0, correct: 0 };
    catMap[cat].total++;
    if (s.is_correct) catMap[cat].correct++;
  }
  const byCategory = Object.entries(catMap).map(([cat, v]) => ({ cat, ...v }));

  return (
    <AnalyticsDashboard
      summary={{ totalStudents, totalSubmissions, correctRate, taskCount: taskCount ?? 0 }}
      rawTimestamps={rawTimestamps}
      pieData={pieData}
      hardest={hardest}
      mostAttempted={mostAttempted}
      byCategory={byCategory}
    />
  );
}
