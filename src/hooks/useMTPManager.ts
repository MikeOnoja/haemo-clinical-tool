import { useState } from "react";
import { calculateMTP } from "../domain/hematology/mtp.engine";
import { saveCase } from "../services/supabase/cases.service";
import { useAuth } from "../components/AuthProvider";

export function useMTPManager() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const runMTP = async (input: any, patientId: string) => {
    setLoading(true);

    const analysis = calculateMTP(input);
    setResult(analysis);

    await saveCase({
      module: "MTP",
      inputData: input,
      result: analysis.message,
      userId: user?.id || null,
      patientId: patientId || null,
    });

    setLoading(false);
  };

  return {
    result,
    loading,
    runMTP,
  };
}