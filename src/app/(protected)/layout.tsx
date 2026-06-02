import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import DashboardTopBar from "@/components/DashboardTopBar";
import type { ReactNode } from "react";
import styles from "./layout.module.css";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: subs } = await supabase
    .from("submissions")
    .select("task_id, score")
    .eq("user_id", user.id);

  const bestPerTask = new Map<string, number>();
  (subs ?? []).forEach((s: { task_id: string; score: number }) => {
    if (!bestPerTask.has(s.task_id) || bestPerTask.get(s.task_id)! < s.score) {
      bestPerTask.set(s.task_id, s.score);
    }
  });
  const totalScore = Math.round(Array.from(bestPerTask.values()).reduce((a, b) => a + b, 0));
  const userInitial = (user.email?.split("@")[0] ?? "U")[0];

  return (
    <div className={styles.shell}>
      <Sidebar email={user.email ?? ""} totalScore={totalScore} />
      <div className={styles.main}>
        <DashboardTopBar userInitial={userInitial} />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
