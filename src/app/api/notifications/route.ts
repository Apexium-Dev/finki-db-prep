import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export interface Notification {
  id: string;
  type: "new_tasks" | "leaderboard";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ notifications: [], unread: 0 }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profileRaw } = await (supabase as any)
    .from("profiles")
    .select("notifications_read_at")
    .eq("id", user.id)
    .single();

  const readAt: string = profileRaw?.notifications_read_at ?? new Date(0).toISOString();

  // New tasks added since last read
  const { data: newTasks } = await supabase
    .from("tasks")
    .select("category, created_at")
    .eq("verified", true)
    .gt("created_at", readAt)
    .order("created_at", { ascending: false });

  type TaskRow = { category: string; created_at: string };
  // Group new tasks by category
  const tasksByCategory = new Map<string, number>();
  (newTasks ?? []).forEach((t: TaskRow) => {
    tasksByCategory.set(t.category, (tasksByCategory.get(t.category) ?? 0) + 1);
  });

  // Leaderboard rank
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: lbData } = await (supabase as any).rpc("get_leaderboard", { limit_n: 10 });
  const rank = (lbData ?? []).findIndex((r: { user_id: string }) => r.user_id === user.id) + 1;

  const notifications: Notification[] = [];

  // Task notifications — one per category
  const CATEGORY_LABELS: Record<string, string> = {
    ddl: "DDL", dml: "DML", trigger: "Trigger", er: "ER Дијаграм",
  };
  tasksByCategory.forEach((count, category) => {
    const label = CATEGORY_LABELS[category] ?? category.toUpperCase();
    const catTasks: TaskRow[] = (newTasks ?? []).filter((t: TaskRow) => t.category === category);
    const oldest: TaskRow | undefined = catTasks[catTasks.length - 1];
    notifications.push({
      id: `tasks_${category}`,
      type: "new_tasks",
      title: `${count} нов${count === 1 ? "а" : "и"} ${label} задач${count === 1 ? "а" : "и"}`,
      body: `Можеш ли да ги решиш${count === 1 ? "?" : " сите?"}`,
      time: oldest ? oldest.created_at : new Date().toISOString(),
      read: false,
    });
  });

  // Leaderboard notification (always shown, marks read state separately)
  if (rank > 0 && rank <= 10) {
    const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
    notifications.push({
      id: "leaderboard_rank",
      type: "leaderboard",
      title: "Ранг листа",
      body: `Моментално си на место ${medal} од топ 10!`,
      time: new Date().toISOString(),
      read: true, // leaderboard is always "read" — it's informational
    });
  }

  const unread = notifications.filter((n) => !n.read).length;
  return NextResponse.json({ notifications, unread });
}

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("profiles")
    .update({ notifications_read_at: new Date().toISOString() })
    .eq("id", user.id);

  return NextResponse.json({ ok: true });
}
