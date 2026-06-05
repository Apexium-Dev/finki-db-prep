"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface UpdateProfileResult {
  error?: string;
  success?: boolean;
}

export async function updateProfile(
  _prev: UpdateProfileResult,
  formData: FormData
): Promise<UpdateProfileResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const displayName = (formData.get("display_name") as string | null)?.trim();
  const username    = (formData.get("username")     as string | null)?.trim() || null;
  const avatarUrl   = (formData.get("avatar_url")   as string | null)?.trim() || null;

  if (!displayName) return { error: "Името не може да биде празно." };

  if (username && !/^[a-z0-9_]{3,30}$/.test(username)) {
    return { error: "Корисничкото име може да содржи само мали букви, бројки и '_' (3–30 знаци)." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("profiles")
    .update({ display_name: displayName, username, avatar_url: avatarUrl })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") return { error: "Корисничкото име веќе е зафатено." };
    return { error: "Настана грешка. Обиди се повторно." };
  }

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  return { success: true };
}
