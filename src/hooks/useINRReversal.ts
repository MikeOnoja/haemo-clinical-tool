import { useState } from "react";
import { useClinicalWorkflow } from "./core/useClinicalWorkflow";

import { assessINRLogic } from "../domain/hematology/inr.engine";
import type { INRInput } from "../domain/hematology/inr.engine";

export function useINRReversal(patientId: string) {
  const [inr, setInr] = useState("");
  const [bleedingInr, setBleedingInr] = useState(false);
  const [procedureUrgent, setProcedureUrgent] = useState(false);

  const workflow = useClinicalWorkflow<INRInput>({
    module: "INR_REVERSAL",
    compute: assessINRLogic,
  });

  const assessINR = async () => {
    await workflow.run(
      {
        inr: Number(inr),
        bleeding: bleedingInr,
        urgentProcedure: procedureUrgent,
      },
      patientId
    );
  };

  return {
    inr,
    setInr,

    bleedingInr,
    setBleedingInr,

    procedureUrgent,
    setProcedureUrgent,

    result: workflow.result,
    loading: workflow.loading,

    assessINR,
  };
}