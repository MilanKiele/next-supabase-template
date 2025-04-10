"use server";

import { profileSchema } from "@/schemas/profile/profile-schemas";
import { createClient } from "@/utils/supabase/server";

export async function getOwnProfileRole() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return null;
  }

  return profile.role;
}

export async function getOwnProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("username, is_blocked")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return null;
  }

  return profile;
}

export async function getOwnProfileId() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return null;
  }

  return profile.id;
}

export async function getUserRole() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  return profile?.role ?? "user";
}

export async function updateUsername(newUsername: string) {
  // Zod-Validation
  const result = profileSchema.safeParse({ username: newUsername });

  if (!result.success) {
    const errorMessage = result.error.errors[0]?.message || "Invalid username";
    return { status: "error", message: errorMessage };
  }

  const supabase = await createClient();

  const { data: existingUser, error: checkError } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("username", newUsername)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    return { status: "error", message: "Error checking username availability" };
  }

  if (existingUser) {
    return { status: "error", message: "Username already taken" };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "error", message: "User not found" };
  }

  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({ username: newUsername })
    .eq("user_id", user.id)
    .single();

  if (updateError) {
    return { status: "error", message: "Error updating username" };
  }

  return { status: "success", message: "Username updated successfully" };
}

export async function isUserBlocked() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null; // oder false, je nachdem wie du es behandeln willst
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("is_blocked")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return null;
  }

  return profile.is_blocked === true;
}
