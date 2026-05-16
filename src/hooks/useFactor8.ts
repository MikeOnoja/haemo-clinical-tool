import { useClinicalWorkflow } from "./core/useClinicalWorkflow";
import { calculateFactor8 } from "../domain/hematology/factor8.engine";

export function useFactor8(patientId: string) {
  const workflow = useClinicalWorkflow({
    module: "FACTOR8",
    compute: calculateFactor8,
  });

  const calculate = (input: any) => workflow.run(input, patientId);

  return {
    run: calculate,
    result: workflow.result,
    loading: workflow.loading,
  };
}