// src/domain/hematology/factor8.engine.ts

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

export type Factor8Result = {
  doseIU: number;
  targetLevel: number;
  requiredRise: number;
  message: string;
  warning?: string;
};

/**
 * Clinical target mapping (haemophilia protocols)
 */
const TARGET_LEVEL_MAP: Record<Factor8Scenario, number> = {
  no_bleed: 5,
  minor_bleed: 30,
  major_bleed: 100,
  minor_surgery: 70,
  major_surgery: 100,
};

/**
 * Factor VIII dosing:
 * IU = weight × required rise × 0.5
 */
export function calculateFactor8(input: Factor8Input): Factor8Result {
  const { weightKg, currentLevel, scenario } = input;

  if (!weightKg || weightKg <= 0) {
    return {
      doseIU: 0,
      targetLevel: 0,
      requiredRise: 0,
      message: "Invalid weight input",
      warning: "Weight must be greater than 0",
    };
  }

  const targetLevel = TARGET_LEVEL_MAP[scenario];
  const requiredRise = Math.max(targetLevel - currentLevel, 0);

  const doseIU = Math.round(weightKg * requiredRise * 0.5);

  let message = "";
  let warning = undefined;

  switch (scenario) {
    case "no_bleed":
      message = "Prophylaxis or no immediate replacement required";
      break;
    case "minor_bleed":
      message = `Treat minor bleed → target ~${targetLevel}% FVIII`;
      break;
    case "major_bleed":
      message = `EMERGENCY: Major bleed → immediate correction to ~${targetLevel}%`;
      warning = "Urgent hematology intervention required";
      break;
    case "minor_surgery":
      message = `Pre-op cover for minor procedure → target ~${targetLevel}%`;
      break;
    case "major_surgery":
      message = `Pre-op cover for major surgery → maintain ~${targetLevel}%`;
      warning = "Requires perioperative factor monitoring";
      break;
  }

  return {
    doseIU,
    targetLevel,
    requiredRise,
    message: `Give ~${doseIU} IU Factor VIII. ${message}`,
    warning,
  };
}