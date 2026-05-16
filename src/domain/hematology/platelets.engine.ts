import type { ClinicalResult } from "../../types/clinical";

export interface PlateletInput {
  plateletCount: number;
  bleeding: boolean;
  procedure: boolean;
  oncology: boolean;
}

export function assessPlateletLogic(
  input: PlateletInput
): ClinicalResult {
  const { plateletCount, bleeding, procedure, oncology } = input;

  if (plateletCount <= 0 || plateletCount > 2000) {
    return {
      title: "Platelet Error",
      message: "Invalid platelet count",
      severity: "high",
      actions: [],
      warning: "Platelet count out of physiological range",
    };
  }

  // Life-threatening bleeding
  if (plateletCount < 10 && bleeding) {
    return {
      title: "Critical Thrombocytopenia with Bleeding",
      message: "Immediate transfusion required",
      severity: "critical",
      indication: "Active bleeding",
      actions: ["Urgent platelet transfusion"],
      warning: "Life-threatening bleeding risk",
    };
  }

  // Severe thrombocytopenia + procedure
  if (plateletCount < 20 && procedure) {
    return {
      title: "Pre-procedure Thrombocytopenia",
      message: "Prepare platelet transfusion before procedure",
      severity: "high",
      indication: "Surgical risk",
      actions: ["Transfuse platelets before procedure"],
    };
  }

  // Oncology threshold
  if (oncology && plateletCount < 20) {
    return {
      title: "Oncology Platelet Threshold",
      message: "Transfusion recommended in oncology context",
      severity: "moderate",
      indication: "Oncology patient",
      actions: ["Consider transfusion if <20"],
    };
  }

  // Moderate risk bleeding
  if (plateletCount < 50 && bleeding) {
    return {
      title: "Moderate Thrombocytopenia with Bleeding",
      message: "Consider transfusion based on clinical severity",
      severity: "moderate",
      indication: "Bleeding risk",
      actions: ["Evaluate need for platelets"],
    };
  }

  // Safe
  return {
    title: "No Platelet Transfusion Required",
    message: "Platelet level acceptable",
    severity: "low",
    indication: "Stable",
    actions: ["No intervention needed"],
  };
}