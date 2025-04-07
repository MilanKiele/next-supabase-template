"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAllUsers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("user_id, email, role, is_blocked");

  if (error) {
    console.error("getAllUsers error:", error.message);
    return [];
  }

  return data;
}
