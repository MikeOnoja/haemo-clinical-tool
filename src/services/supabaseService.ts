import { supabase } from "../supabase";

export interface CaseData {
  module: string;
  inputData: Record<string, any>;
  result: string;
  userId: string | null;
  patientId: string | null;
}

export const supabaseService = {
  async saveCase(caseData: CaseData) {
    const { error } = await supabase.from("clinical_cases").insert([
      {
        user_id: caseData.userId,
        patient_id: caseData.patientId || null,
        module: caseData.module,
        input_data: caseData.inputData,
        result: caseData.result,
        created_at: new Date().toISOString(),
      },
    ]);

    return { error };
  },

  async getUser() {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
  },
};
