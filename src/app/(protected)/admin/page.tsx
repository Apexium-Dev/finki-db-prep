import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminPanel from "./AdminPanel";

const ADMIN_IDS = new Set([
  "81a572ca-2617-4f74-be71-96f61476593f",
  "0a642287-f1c0-40fd-97fc-ff511f70c0db",
]);

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !ADMIN_IDS.has(user.id)) redirect("/dashboard");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("feedback")
    .select("id, type, message, status, created_at, user_id, task_id")
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  const userIds: string[] = Array.from(
    new Set(rows.map((r: { user_id: string }) => r.user_id).filter(Boolean)),
  );
  const taskIds: string[] = Array.from(
    new Set(rows.map((r: { task_id: string }) => r.task_id).filter(Boolean)),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profiles } = await (supabase as any)
    .from("profiles")
    .select("id, display_name")
    .in(
      "id",
      userIds.length > 0 ? userIds : ["00000000-0000-0000-0000-000000000000"],
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tasks } = await (supabase as any)
    .from("tasks")
    .select("id, title")
    .in(
      "id",
      taskIds.length > 0 ? taskIds : ["00000000-0000-0000-0000-000000000000"],
    );

  const nameMap: Record<string, string> = {};
  for (const p of profiles ?? []) nameMap[p.id] = p.display_name ?? "—";

  const taskMap: Record<string, string> = {};
  for (const t of tasks ?? []) taskMap[t.id] = t.title;

  const enriched = rows.map(
    (r: {
      id: string;
      type: string;
      message: string;
      status: string;
      created_at: string;
      user_id: string;
      task_id: string | null;
    }) => ({
      ...r,
      display_name: nameMap[r.user_id] ?? "—",
      task_title: r.task_id ? (taskMap[r.task_id] ?? r.task_id) : null,
    }),
  );

  return <AdminPanel rows={enriched} />;
}
