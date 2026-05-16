import type { ClinicalResult } from "../../types/clinical";

export interface FFPInput {
  weight: number;
  inr: number;
  bleeding: boolean;
}

export function assessFFPLogic(input: FFPInput): ClinicalResult {
  const { weight, inr, bleeding } = input;

  if (weight <= 0 || weight > 300) {
    return {
      title: "FFP Error",
      message: "Invalid body weight",
      severity: "high",
    };
  }

  if (inr <= 0 || inr > 20) {
    return {
      title: "FFP Error",
      message: "Invalid INR value",
      severity: "high",
    };
  }

  const estimatedDose = Math.round(weight * 15);

  if (bleeding && inr >= 1.5) {
    return {
      title: "FFP Indicated",
      message: `Bleeding with elevated INR`,
      severity: "high",
      indication: "Active bleeding",
      units: estimatedDose,
      volumeMl: estimatedDose,
      urgency: "urgent",
      actions: ["Give FFP immediately"],
    };
  }

  if (inr >= 2.0) {
    return {
      title: "FFP Consideration",
      message: "Moderate INR elevation",
      severity: "moderate",
      indication: "Coagulopathy",
      units: estimatedDose,
      volumeMl: estimatedDose,
      urgency: "semi-urgent",
      actions: ["Consider FFP"],
    };
  }

  return {
    title: "No FFP Required",
    message: "Coagulation acceptable",
    severity: "low",
    actions: ["Observe only"],
  };
}