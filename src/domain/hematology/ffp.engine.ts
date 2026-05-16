export interface FFPInput {
  weight: number;
  inr: number;
  bleeding: boolean;
}

export function assessFFPLogic(
  input: FFPInput
): string {
  const { weight, inr, bleeding } = input;

  if (weight <= 0 || weight > 300) {
    return "🚨 Invalid body weight";
  }

  if (inr <= 0 || inr > 20) {
    return "🚨 Invalid INR value";
  }

  const estimatedDose = Math.round(weight * 15);

  if (bleeding && inr >= 1.5) {
    return `⚠️ Recommended FFP dose: ${estimatedDose} mL`;
  }

  if (inr >= 2.0) {
    return `⚠️ Consider FFP: estimated dose ${estimatedDose} mL`;
  }

  return "✅ FFP not currently indicated";
}