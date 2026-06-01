export type TaskCategory = "ddl" | "dml" | "trigger" | "er" | "relations";

export interface HintItem {
  level: number;
  text: string;
  score_penalty: number;
}

export interface WalkthroughStep {
  step: number;
  explanation: string;
}

export interface Task {
  id: string;
  category: TaskCategory;
  difficulty: number;
  title: string;
  prompt: string;
  setup_sql: string;
  seed_sql: string;
  reference_solution: string;
  test_cases: Record<string, unknown>[] | null;
  hints: HintItem[] | null;
  walkthrough: WalkthroughStep[] | null;
  tags: string[];
  points: number;
  source: "manual" | "generated";
  verified: boolean;
  created_at: string;
}

export interface Submission {
  id: string;
  user_id: string;
  task_id: string;
  answer: string;
  is_correct: boolean;
  score: number;
  hints_used: number;
  time_taken_seconds: number | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: Task;
        Insert: Omit<Task, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Task, "id">>;
      };
      submissions: {
        Row: Submission;
        Insert: Omit<Submission, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Submission, "id">>;
      };
    };
  };
}
