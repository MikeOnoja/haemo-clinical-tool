import { useState, useCallback } from "react";
import { supabaseService } from "../services/supabaseService";
import type { AlertType } from "../utils/constants";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/constants";

export interface UseSaveCase {
  loading: boolean;
  saveCase: (
    module: string,
    inputData: Record<string, any>,
    result: string,
    userId: string | null,
    patientId: string | null,
    onAlert: (message: string, type: AlertType, options?: { dismissible?: boolean; autoClose?: boolean }) => void
  ) => Promise<void>;
}

export function useSupabaseCRUD(): UseSaveCase {
  const [loading, setLoading] = useState(false);

  const saveCase = useCallback(
    async (
      module: string,
      inputData: Record<string, any>,
      result: string,
      userId: string | null,
      patientId: string | null,
      onAlert: (message: string, type: AlertType, options?: { dismissible?: boolean; autoClose?: boolean }) => void
    ) => {
      try {
        setLoading(true);
        const { error } = await supabaseService.saveCase({
          module,
          inputData,
          result,
          userId,
          patientId,
        });

        if (error) {
          console.error("Supabase error:", error.message);
          let errorMsg: string = ERROR_MESSAGES.SAVE_FAILED;

          if (error.message.includes("ForeignKeyViolation")) {
            errorMsg = "Invalid patient ID. Please verify and try again.";
          } else if (error.message.includes("connection")) {
            errorMsg = ERROR_MESSAGES.NETWORK_ERROR;
          } else if (error.message.includes("permission")) {
            errorMsg = ERROR_MESSAGES.AUTH_ERROR;
          }

          onAlert(`❌ ${errorMsg}`, "error", { dismissible: true, autoClose: false });
        } else {
          onAlert(`✅ ${SUCCESS_MESSAGES.SAVED}`, "success", { dismissible: true, autoClose: true });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("Error saving case:", errorMessage);

        let errorMsg: string = ERROR_MESSAGES.UNEXPECTED_ERROR;
        if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
          errorMsg = ERROR_MESSAGES.NETWORK_ERROR;
        }

        onAlert(`❌ ${errorMsg}`, "error", { dismissible: true, autoClose: false });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, saveCase };
}
