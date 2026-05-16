import { useState } from "react";

import { useClinicalWorkflow } from "./core/useClinicalWorkflow";

import { assessPlateletLogic } from "../domain/hematology/platelets.engine";
import type { PlateletInput } from "../domain/hematology/platelets.engine";

export function usePlateletDecision(patientId: string) {
  const [plateletCount, setPlateletCount] = useState("");
  const [bleeding, setBleeding] = useState(false);
  const [procedure, setProcedure] = useState(false);
  const [oncology, setOncology] = useState(false);

  const workflow = useClinicalWorkflow<PlateletInput>({
    module: "PLATELET",
    compute: assessPlateletLogic,
  });

  const assess = async () => {
    await workflow.run(
      {
        plateletCount: Number(plateletCount),
        bleeding,
        procedure,
        oncology,
      },
      patientId
    );
  };

  return {
    plateletCount,
    setPlateletCount,

    bleeding,
    setBleeding,

    procedure,
    setProcedure,

    oncology,
    setOncology,

    result: workflow.result,
    loading: workflow.loading,

    assess,
  };
}