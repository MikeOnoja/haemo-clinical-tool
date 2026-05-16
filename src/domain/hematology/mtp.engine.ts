import type { ClinicalResult } from "../../types/clinical";

export interface MTPInput {
  weight: number;
  activeBleeding: boolean;
  trauma: boolean;
  obstetric: boolean;
  hb: number;
}

export function calculateMTP(input: MTPInput): ClinicalResult {
  const severity =
    (input.activeBleeding ? 2 : 0) +
    (input.trauma ? 2 : 0) +
    (input.obstetric ? 2 : 0) +
    (input.hb < 7 ? 1 : 0);

  if (severity >= 4) {
    return {
      title: "MTP Activated",
      message: "Massive transfusion protocol required",
      severity: "critical",
      rbcUnits: 6,
      ffpUnits: 6,
      plateletUnits: 1,
      actions: ["Activate MTP immediately"],
    };
  }

  if (severity >= 2) {
    return {
      title: "MTP Standby",
      message: "Prepare blood products",
      severity: "moderate",
      rbcUnits: 3,
      ffpUnits: 3,
      plateletUnits: 1,
      actions: ["Prepare units", "Monitor patient"],
    };
  }

  return {
    title: "No MTP Required",
    message: "Supportive care only",
    severity: "low",
    rbcUnits: 0,
    ffpUnits: 0,
    plateletUnits: 0,
    actions: ["Observe"],
  };
}