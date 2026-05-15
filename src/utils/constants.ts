// =========================================
// CONSTANTS
// =========================================
export const CONSTANTS = {
  ALERT_TIMEOUT_MS: 5000,
  AUTO_CLOSE_ALERT_TIMEOUT_MS: 4000,
  FACTOR_VIII_CONSTANT: 0.5,
  FFP_MULTIPLIER: 12,
  INR_CRITICAL_THRESHOLD: 20,
  INR_HIGH_THRESHOLD: 5,
  INR_MODERATE_THRESHOLD: 2,
  PLATELET_MAX_REALISTIC: 1000,
  PLATELET_URGENT: 10,
  PLATELET_TRANSFUSION_WITH_BLEEDING: 50,
  PLATELET_CONSIDER_TRANSFUSION: 20,
} as const;

export const ERROR_MESSAGES = {
  SAVE_FAILED: "Failed to save case. Please check your internet connection and try again.",
  UNEXPECTED_ERROR: "An unexpected error occurred. Please try again.",
  INVALID_INPUT: "Invalid input. Please enter valid numbers.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  AUTH_ERROR: "Authentication error. Please log in again.",
  VALIDATION_FAILED: "Validation failed. Please check your inputs.",
} as const;

export const SUCCESS_MESSAGES = {
  SAVED: "Case saved successfully!",
  CALCULATED: "Calculation completed!",
} as const;

export const VALIDATION = {
  isValidNumber: (value: string): boolean => {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num);
  },
  parseNumeric: (value: string): number | null => {
    const num = parseFloat(value);
    return isNaN(num) || !isFinite(num) ? null : num;
  },
} as const;

export type TabType = "factor8" | "platelets" | "ffp" | "inr" | "mtp";
export type AlertType = "success" | "error" | "info" | "warning";

export interface User {
  id: string;
  email?: string;
}

export interface AlertState {
  id: string;
  message: string;
  type: AlertType;
  dismissible?: boolean;
  autoClose?: boolean;
}
