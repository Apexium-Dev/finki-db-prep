import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminPanel from "./AdminPanel";

const ADMIN_ID = "81a572ca-2617-4f74-be71-96f61476593f";

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== ADMIN_ID) redirect("/dashboard");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("feedback")
    .select("id, type, message, status, created_at, user_id")
    .order("created_at", { ascending: false });

  const userIds: string[] = Array.from(new Set((data ?? []).map((r: { user_id: string }) => r.user_id).filter(Boolean)));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profiles } = await (supabase as any)
    .from("profiles")
    .select("id, display_name")
    .in("id", userIds.length > 0 ? userIds : ["00000000-0000-0000-0000-000000000000"]);

  const nameMap: Record<string, string> = {};
  for (const p of profiles ?? []) nameMap[p.id] = p.display_name ?? p.id;

  const rows = (data ?? []).map((r: {
    id: string; type: string; message: string; status: string; created_at: string; user_id: string;
  }) => ({ ...r, display_name: nameMap[r.user_id] ?? "—" }));

  return <AdminPanel rows={rows} />;
}
