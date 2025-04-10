"use server";

import { PostSchema } from "@/schemas/posts/post-schemas";
import { createClient } from "@/utils/supabase/server";

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "error", message: "Not logged in" };
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { status: "error", message: "Profile not found" };
  }

  // Get form values
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // ✅ Validate the title and content using Zod schema
  const validation = PostSchema.safeParse({ title, content });

  if (!validation.success) {
    return {
      status: "error",
      message: validation.error.errors[0]?.message || "Invalid input",
    };
  }

  // Insert into posts
  const { error: insertError } = await supabase.from("posts").insert({
    title,
    content,
    profile_id: profile.id,
  });

  if (insertError) {
    return { status: "error", message: insertError.message };
  }

  return { status: "success" };
}

export async function getAllPosts() {
  const supabase = await createClient();

  // 1. Alle Posts holen
  const { data: postsData, error: postsError } = await supabase
    .from("posts")
    .select("id, title, content, profile_id, created_at")
    .order("created_at", { ascending: false });

  if (postsError || !postsData) {
    return {
      status: "error",
      message: postsError?.message ?? "Fehler beim Laden der Beiträge",
    };
  }

  // 2. Alle eindeutigen profile_ids sammeln
  const profileIds = [...new Set(postsData.map((post) => post.profile_id))];

  // 3. Alle zugehörigen Usernames abfragen
  const { data: profilesData, error: profilesError } = await supabase
    .from("user_profiles")
    .select("id, username")
    .in("id", profileIds);

  if (profilesError || !profilesData) {
    return {
      status: "error",
      message: profilesError?.message ?? "Fehler beim Laden der Profile",
    };
  }

  // 4. Map: profile_id -> username
  const profileMap: Record<string, string> = {};
  for (const profile of profilesData) {
    profileMap[profile.id] = profile.username ?? "Unbekannt";
  }

  // 5. Kombinieren der Daten
  const normalizedPosts = postsData.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    profile_id: post.profile_id,
    created_at: post.created_at,
    username: profileMap[post.profile_id] ?? "Unbekannt",
  }));

  return {
    status: "success",
    posts: normalizedPosts,
  };
}

// EIGENEN POST BEARBEITEN
export async function updateOwnPost(
  postId: number,
  title: string,
  content: string
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "error", message: "Nicht eingeloggt" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { status: "error", message: "Profil nicht gefunden" };
  }

  const { error: updateError } = await supabase
    .from("posts")
    .update({ title, content })
    .eq("id", postId)
    .eq("profile_id", profile.id);

  if (updateError) {
    return { status: "error", message: updateError.message };
  }

  return { status: "success" };
}

// EIGENEN POST LÖSCHEN
export async function deleteOwnPost(postId: number) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "error", message: "Nicht eingeloggt" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { status: "error", message: "Profil nicht gefunden" };
  }

  const { error: deleteError } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("profile_id", profile.id);

  if (deleteError) {
    return { status: "error", message: deleteError.message };
  }

  return { status: "success" };
}
