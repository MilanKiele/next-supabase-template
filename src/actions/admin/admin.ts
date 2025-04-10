"use server";

import { createClient } from "@/utils/supabase/server";
import { getOwnProfileRole } from "../profile/profile";

// Function to check admin rights
export async function allowAdminFunction() {
  const role = await getOwnProfileRole();

  // If the role is not admin, return an error message
  if (role !== "admin") {
    return { status: "error", message: "No admin rights" };
  }

  return { status: "success" };
}

// Delete a post as admin
export async function deletePostAsAdmin(postId: number) {
  // Check if the user has admin rights
  const { status, message } = await allowAdminFunction();
  if (status === "error") {
    return { status, message }; // Return error message if the user is not an admin
  }

  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) return { status: "error", message: error.message };
  return { status: "success" };
}

// Toggle block/unblock for a user
export async function toggleBlockUser(userId: string, block: boolean) {
  // Check if the user has admin rights
  const { status, message } = await allowAdminFunction();
  if (status === "error") {
    return { status, message }; // Return error message if the user is not an admin
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("user_profiles")
    .update({ is_blocked: block })
    .eq("user_id", userId);

  if (error) return { status: "error", message: error.message };
  return { status: "success" };
}

// Get all users
export async function getAllUsers() {
  // Check if the user has admin rights
  const { status, message } = await allowAdminFunction();
  if (status === "error") {
    return { status, message }; // Return error message if the user is not an admin
  }

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

// Set user role (admin or user)
export async function setUserRole(userId: string, newRole: "admin" | "user") {
  // Check if the user has admin rights
  const { status, message } = await allowAdminFunction();
  if (status === "error") {
    return { status, message }; // Return error message if the user is not an admin
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("user_profiles")
    .update({ role: newRole })
    .eq("user_id", userId);

  if (error) {
    return { status: "error", message: error.message };
  }

  return { status: "success", message: `Role updated to ${newRole}` };
}
