import { useState, useCallback } from "react";
import { assessPlateletLogic } from "../domain/hematology/platelets.engine";
import { saveCase } from "../services/supabase/cases.service";
import { useAlertContext } from "../components/AlertProvider";
import { useAuth } from "../components/AuthProvider";

export function usePlateletDecision(patientId: string) {
  const [plateletCount, setPlateletCount] = useState("");
  const [bleeding, setBleeding] = useState(false);
  const [procedure, setProcedure] = useState(false);
  const [oncology, setOncology] = useState(false);

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const { addAlert } = useAlertContext();
  const { user } = useAuth();

  const assess = useCallback(async () => {
    const value = parseFloat(plateletCount);

    if (isNaN(value)) {
      setResult("❌ Invalid platelet count");
      return;
    }

    const decision = assessPlateletLogic({
      plateletCount: value,
      bleeding,
      procedure,
      oncology,
    });

    setResult(decision);

    try {
      setLoading(true);

      const { error } = await saveCase({
        module: "PLATELET",
        inputData: {
          plateletCount: value,
          bleeding,
          procedure,
          oncology,
        },
        result: decision,
        userId: user?.id || null,
        patientId: patientId || null,
      });

      if (error) addAlert("Save failed", "error");
      else addAlert("Case saved", "success");
    } finally {
      setLoading(false);
    }
  }, [plateletCount, bleeding, procedure, oncology]);

  return {
    plateletCount,
    setPlateletCount,
    bleeding,
    setBleeding,
    procedure,
    setProcedure,
    oncology,
    setOncology,
    result,
    loading,
    assess,
  };
}