import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ReactNode } from "react";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <>{children}</>;
}
