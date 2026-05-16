import { supabase } from "./client";

export const authService = {
  async getUser() {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
  },
};