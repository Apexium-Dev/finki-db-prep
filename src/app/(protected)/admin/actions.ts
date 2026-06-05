"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markReviewed(id: string) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("feedback").update({ status: "reviewed" }).eq("id", id);
  revalidatePath("/admin");
}
