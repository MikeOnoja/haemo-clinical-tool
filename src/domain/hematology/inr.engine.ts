import type { ClinicalResult } from "../../types/clinical";

export interface INRInput {
  inr: number;
  bleeding: boolean;
  urgentProcedure: boolean;
}

export function assessINRLogic(input: INRInput): ClinicalResult {
  const { inr, bleeding, urgentProcedure } = input;

  if (inr <= 0 || inr > 20) {
    return {
      title: "INR Error",
      message: "Invalid INR range",
      severity: "high",
    };
  }

  if (inr >= 5 && bleeding) {
    return {
      title: "Critical INR",
      message: "Life-threatening anticoagulation",
      severity: "critical",
      riskLevel: "high",
      urgency: "immediate",
      actions: ["PCC", "Vitamin K"],
    };
  }

  if (inr >= 5) {
    return {
      title: "High INR",
      message: "Severely elevated INR",
      severity: "high",
      riskLevel: "moderate",
      actions: ["Hold anticoagulant", "Vitamin K"],
    };
  }

  if (inr >= 2 && urgentProcedure) {
    return {
      title: "Procedure Risk INR",
      message: "Moderate elevation before procedure",
      severity: "moderate",
      urgency: "pre-op",
      actions: ["Consider reversal"],
    };
  }

  return {
    title: "Normal INR",
    message: "No reversal required",
    severity: "low",
    actions: ["No action"],
  };
}