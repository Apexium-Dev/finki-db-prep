import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import type { ReactNode } from "react";
import styles from "./layout.module.css";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch user's total score for level display
  const { data: subs } = await supabase
    .from("submissions")
    .select("task_id, score")
    .eq("user_id", user.id);

  // Best score per task
  const bestPerTask = new Map<string, number>();
  (subs ?? []).forEach((s: { task_id: string; score: number }) => {
    if (!bestPerTask.has(s.task_id) || bestPerTask.get(s.task_id)! < s.score) {
      bestPerTask.set(s.task_id, s.score);
    }
  });
  const totalScore = Math.round(Array.from(bestPerTask.values()).reduce((a, b) => a + b, 0));

  return (
    <div className={styles.shell}>
      <Sidebar email={user.email ?? ""} totalScore={totalScore} />
      <div className={styles.main}>{children}</div>
    </div>
  );
}
