import { useClinicalWorkflow } from "./core/useClinicalWorkflow";

import { calculateMTP } from "../domain/hematology/mtp.engine";
import type { MTPInput } from "../domain/hematology/mtp.engine";

export function useMTPManager() {
  const workflow = useClinicalWorkflow<MTPInput>({
    module: "MTP",
    compute: calculateMTP,
  });

  return {
    runMTP: workflow.run,
    result: workflow.result,
    loading: workflow.loading,
  };
}