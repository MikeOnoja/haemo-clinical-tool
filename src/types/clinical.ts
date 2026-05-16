export interface ClinicalResult {
  title: string;
  message: string;

  severity?: "low" | "moderate" | "high" | "critical";
  indication?: string;
  riskLevel?: string;
  urgency?: string;

  actions?: string[];
  warning?: string;

  // optional computed values
  [key: string]: any;
}