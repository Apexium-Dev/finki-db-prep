import { notFound } from "next/navigation";
import { createProfessorClient } from "@/lib/supabase/professor";
import ExamTaskSolver from "@/components/ExamTaskSolver";

interface PageProps {
  params: { id: string };
}

export default async function ExamTaskPage({ params }: PageProps) {
  const prof = createProfessorClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (prof as any)
    .from("tasks")
    .select("id, category, difficulty, title, prompt, setup_sql, points")
    .eq("id", params.id)
    .single();

  if (error || !data) notFound();

  return <ExamTaskSolver task={data} />;
}
