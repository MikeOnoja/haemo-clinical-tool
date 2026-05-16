import { useState, useCallback } from "react";
import { useAuth } from "../../components/AuthProvider";
import { useAlertContext } from "../../components/AlertProvider";
import { saveCase } from "../../services/supabase/cases.service";
import type { ClinicalResult } from "../../types/clinical";

type WorkflowParams<Input> = {
  module: string;
  compute: (input: Input) => ClinicalResult;
};

export function useClinicalWorkflow<Input>({
  module,
  compute,
}: WorkflowParams<Input>) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClinicalResult | null>(null);

  const { user } = useAuth();
  const { addAlert } = useAlertContext();

  const run = useCallback(
    async (input: Input, patientId: string | null) => {
      try {
        setLoading(true);

        const computed = compute(input);
        setResult(computed);

        const { error } = await saveCase({
          module,
          inputData: input as any,
          result: JSON.stringify(computed),
          userId: user?.id || null,
          patientId,
        });

        if (error) {
          addAlert("Save failed", "error");
        } else {
          addAlert("Saved successfully", "success");
        }
      } catch {
        addAlert("Unexpected clinical error", "error");
      } finally {
        setLoading(false);
      }
    },
    [module, compute, user?.id]
  );

  return {
    run,
    result,
    loading,
  };
}