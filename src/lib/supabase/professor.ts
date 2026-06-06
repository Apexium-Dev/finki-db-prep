import { createClient } from "@supabase/supabase-js";

export function createProfessorClient() {
  return createClient(
    process.env.PROF_SUPABASE_URL!,
    process.env.PROF_SUPABASE_SERVICE_KEY!,
  );
}
