import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import type { ReactNode } from "react";
import styles from "./layout.module.css";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className={styles.shell}>
      <Sidebar email={user.email ?? ""} />
      <div className={styles.main}>{children}</div>
    </div>
  );
}
