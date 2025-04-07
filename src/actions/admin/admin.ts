"use server";

import { createClient } from "@/utils/supabase/server";

export async function deletePostAsAdmin(postId: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) return { status: "error", message: error.message };
  return { status: "success" };
}

export async function toggleBlockUser(userId: string, block: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("user_profiles")
    .update({ is_blocked: block })
    .eq("user_id", userId);

  if (error) return { status: "error", message: error.message };
  return { status: "success" };
}
