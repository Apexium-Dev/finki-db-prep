import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TaskSolver from "@/components/TaskSolver";
import type { Task } from "@/types/database";

// Dynamic import to avoid loading React Flow on non-ER tasks
import dynamic from "next/dynamic";
const ErSolver = dynamic(() => import("@/components/er/ErSolver"), { ssr: false });

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

  const task = data as Task;

  if (task.category === "er") {
    return <ErSolver task={task} />;
  }

  return <TaskSolver task={task} />;
}
