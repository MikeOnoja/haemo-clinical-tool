import { useState, useCallback } from "react";
import * as casesService from "../services/supabase/cases.service";
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
      onAlert: (
        message: string,
        type: AlertType,
        options?: { dismissible?: boolean; autoClose?: boolean }
      ) => void
    ) => {
      try {
        setLoading(true);

        const { error } = await casesService.saveCase({
          module,
          inputData,
          result,
          userId,
          patientId,
        });

        if (error) {
          onAlert(`❌ ${ERROR_MESSAGES.SAVE_FAILED}`, "error", {
            dismissible: true,
            autoClose: false,
          });
        } else {
          onAlert(`✅ ${SUCCESS_MESSAGES.SAVED}`, "success", {
            dismissible: true,
            autoClose: true,
          });
        }
      } catch (err) {
        onAlert(`❌ ${ERROR_MESSAGES.UNEXPECTED_ERROR}`, "error", {
          dismissible: true,
          autoClose: false,
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, saveCase };
}