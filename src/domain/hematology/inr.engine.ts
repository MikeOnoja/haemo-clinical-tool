export interface INRInput {
  inr: number;
  bleeding: boolean;
  urgentProcedure: boolean;
}

export function assessINRLogic(input: INRInput): string {
  const { inr, bleeding, urgentProcedure } = input;

  // Safety guard
  if (inr <= 0 || inr > 20) {
    return "🚨 CRITICAL ERROR: INR value out of physiological range";
  }

  // Emergency bleeding scenario
  if (inr >= 5 && bleeding) {
    return "🚨 URGENT: Administer PCC + Vitamin K immediately";
  }

  // High INR without bleeding
  if (inr >= 5) {
    return "⚠️ High INR: consider holding anticoagulant ± Vitamin K";
  }

  // Moderate risk with procedure
  if (inr >= 2 && urgentProcedure) {
    return "⚠️ Moderate INR: consider reversal prior to procedure";
  }

  return "✅ No reversal required at this time";
}