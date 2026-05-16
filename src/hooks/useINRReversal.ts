import { useState, useCallback } from "react";
import { assessINRLogic } from "../domain/hematology/inr.engine";
import { saveCase } from "../services/supabase/cases.service";
import { useAlertContext } from "../components/AlertProvider";
import { useAuth } from "../components/AuthProvider";

export function useINRReversal(patientId: string) {
  const [inr, setInr] = useState("");
  const [bleedingInr, setBleedingInr] = useState(false);
  const [procedureUrgent, setProcedureUrgent] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const { addAlert } = useAlertContext();
  const { user } = useAuth();

  const assessINR = useCallback(async () => {
    const value = parseFloat(inr);

    if (isNaN(value)) {
      setResult("❌ Invalid INR value");
      addAlert("Invalid INR value", "error");
      return;
    }

    const decision = assessINRLogic({
      inr: value,
      bleeding: bleedingInr,
      urgentProcedure: procedureUrgent,
    });

    setResult(decision);

    try {
      setLoading(true);

      const { error } = await saveCase({
        module: "INR",
        inputData: {
          inr: value,
          bleeding: bleedingInr,
          urgentProcedure: procedureUrgent,
        },
        result: decision,
        userId: user?.id || null,
        patientId: patientId || null,
      });

      if (error) {
        addAlert("Failed to save case", "error");
      } else {
        addAlert("Case saved successfully", "success");
      }
    } catch (err) {
      addAlert("Unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  }, [inr, bleedingInr, procedureUrgent, patientId, user?.id, addAlert]);

  return {
    inr,
    setInr,
    bleedingInr,
    setBleedingInr,
    procedureUrgent,
    setProcedureUrgent,
    result,
    loading,
    assessINR,
  };
}