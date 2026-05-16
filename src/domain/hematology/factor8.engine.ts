import type { ClinicalResult } from "../../types/clinical";

export type Factor8Scenario =
  | "no_bleed"
  | "minor_bleed"
  | "major_bleed"
  | "minor_surgery"
  | "major_surgery";

export type Factor8Input = {
  weightKg: number;
  currentLevel: number; // %
  scenario: Factor8Scenario;
};

const TARGET_LEVEL_MAP: Record<Factor8Scenario, number> = {
  no_bleed: 5,
  minor_bleed: 30,
  major_bleed: 100,
  minor_surgery: 70,
  major_surgery: 100,
};

export function calculateFactor8(input: Factor8Input): ClinicalResult {
  const { weightKg, currentLevel, scenario } = input;

  if (!weightKg || weightKg <= 0) {
    return {
      title: "Factor VIII Calculation Error",
      message: "Invalid weight input",
      severity: "high",
      warning: "Weight must be greater than 0",
      actions: [],
    };
  }

  const targetLevel = TARGET_LEVEL_MAP[scenario];
  const requiredRise = Math.max(targetLevel - currentLevel, 0);
  const doseIU = Math.round(weightKg * requiredRise * 0.5);

  let severity: ClinicalResult["severity"] = "low";
  let actions: string[] = [];

  switch (scenario) {
    case "no_bleed":
      actions = ["No immediate treatment required"];
      break;

    case "minor_bleed":
      actions = [`Treat minor bleed to target ${targetLevel}%`];
      break;

    case "major_bleed":
      severity = "critical";
      actions = [`URGENT: correct to ${targetLevel}% immediately`];
      break;

    case "minor_surgery":
      actions = [`Pre-op cover target ${targetLevel}%`];
      break;

    case "major_surgery":
      severity = "high";
      actions = [`Maintain ${targetLevel}% perioperatively`];
      break;
  }

  return {
    title: "Factor VIII Dose Calculation",
    message: `Give ~${doseIU} IU Factor VIII`,
    severity,
    indication: scenario,
    actions: [`Dose: ${doseIU} IU`, ...actions],
    warning:
      scenario === "major_bleed"
        ? "Urgent hematology intervention required"
        : undefined,
  };
}