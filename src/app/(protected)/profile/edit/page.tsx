import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileEditForm from "./ProfileEditForm";

export default async function ProfileEditPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profileRaw } = await (supabase as any)
    .from("profiles")
    .select("display_name, username, avatar_url")
    .eq("id", user.id)
    .single();

  const profile = profileRaw as {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;

  return (
    <ProfileEditForm
      userId={user.id}
      email={user.email ?? ""}
      initialDisplayName={profile?.display_name ?? ""}
      initialUsername={profile?.username ?? ""}
      initialAvatarUrl={profile?.avatar_url ?? ""}
    />
  );
}
