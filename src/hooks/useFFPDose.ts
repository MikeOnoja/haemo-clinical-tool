import { useState } from "react";
import { useClinicalWorkflow } from "./core/useClinicalWorkflow";
import { assessFFPLogic } from "../domain/hematology/ffp.engine";
import type { FFPInput } from "../domain/hematology/ffp.engine";

export function useFFPDose(patientId: string) {
  const [weight, setWeight] = useState("");
  const [inr, setInr] = useState("");
  const [bleeding, setBleeding] = useState(false);

  const workflow = useClinicalWorkflow<FFPInput>({
    module: "FFP_DOSE",
    compute: assessFFPLogic,
  });

  const assess = async () => {
    await workflow.run(
      {
        weight: Number(weight),
        inr: Number(inr),
        bleeding,
      },
      patientId
    );
  };

  return {
    weight,
    setWeight,

    inr,
    setInr,

    bleeding,
    setBleeding,

    result: workflow.result,
    loading: workflow.loading,

    assess,
  };
}