import { supabase } from "./client";

export interface CaseData {
  module: string;
  inputData: Record<string, any>;
  result: string;
  userId: string | null;
  patientId: string | null;
}

export async function saveCase(caseData: CaseData) {
  const { data, error } = await supabase
    .from("clinical_cases")
    .insert([
      {
        user_id: caseData.userId,
        patient_id: caseData.patientId || null,
        module: caseData.module,
        input_data: caseData.inputData,
        result: caseData.result,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  console.log("SUPABASE INSERT DATA:", data);
  console.log("SUPABASE INSERT ERROR:", error);

  return { error };
}

export async function getUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (
    error &&
    error.message !== "Auth session missing!"
  ) {
    console.error("Auth error:", error.message);
  }

  return user || null;
}
