import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TaskSolver from "@/components/TaskSolver";
import type { Task } from "@/types/database";

interface PageProps {
  params: { id: string };
}

export default async function TaskPage({ params }: PageProps) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) notFound();

  return <TaskSolver task={data as Task} />;
}
