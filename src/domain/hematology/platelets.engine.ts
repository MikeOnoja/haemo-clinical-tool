export interface PlateletInput {
  plateletCount: number;
  bleeding: boolean;
  procedure: boolean;
  oncology: boolean;
}

export function assessPlateletLogic(input: PlateletInput): string {
  const { plateletCount, bleeding, procedure, oncology } = input;

  if (plateletCount <= 0 || plateletCount > 2000) {
    return "🚨 INVALID platelet count";
  }

  // Life-threatening bleeding
  if (plateletCount < 10 && bleeding) {
    return "🚨 URGENT: Immediate platelet transfusion required";
  }

  // Severe thrombocytopenia
  if (plateletCount < 20 && procedure) {
    return "⚠️ Prepare platelet transfusion before procedure";
  }

  // Oncology threshold
  if (oncology && plateletCount < 20) {
    return "⚠️ Oncology threshold: transfuse if <20";
  }

  // Moderate risk
  if (plateletCount < 50 && bleeding) {
    return "⚠️ Consider platelet transfusion depending on severity";
  }

  return "✅ No platelet transfusion required";
}