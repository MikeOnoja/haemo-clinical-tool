import { useState, useCallback } from "react";

import { assessFFPLogic } from "../domain/hematology/ffp.engine";

import { useSupabaseCRUD } from "./useSupabaseCRUD";

import { useAlertContext } from "../components/AlertProvider";

import { useAuth } from "../components/AuthProvider";

export function useFFPDose(patientId: string) {
  const [weight, setWeight] = useState("");
  const [inr, setInr] = useState("");
  const [bleeding, setBleeding] = useState(false);

  const [result, setResult] = useState("");

  const { loading, saveCase } =
    useSupabaseCRUD();

  const { addAlert } = useAlertContext();

  const { user } = useAuth();

  const assess = useCallback(async () => {
    const parsedWeight = parseFloat(weight);

    const parsedInr = parseFloat(inr);

    if (
      isNaN(parsedWeight) ||
      isNaN(parsedInr)
    ) {
      setResult(
        "❌ Invalid weight or INR value"
      );

      return;
    }

    const decision = assessFFPLogic({
      weight: parsedWeight,
      inr: parsedInr,
      bleeding,
    });

    setResult(decision);

    await saveCase(
      "FFP",
      {
        weight: parsedWeight,
        inr: parsedInr,
        bleeding,
      },
      decision,
      user?.id || null,
      patientId || null,
      addAlert
    );
  }, [
    weight,
    inr,
    bleeding,
    saveCase,
    addAlert,
    user?.id,
    patientId,
  ]);

  return {
    weight,
    setWeight,

    inr,
    setInr,

    bleeding,
    setBleeding,

    result,

    loading,

    assess,
  };
}