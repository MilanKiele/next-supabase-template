"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import {
  EmailSchema,
  PasswordSchema,
  RegisterSchema,
} from "@/schemas/auth/auth-schemas";
import { usernameSchema } from "@/schemas/profile/profile-schemas";

export async function getUserSession() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return { status: "success", user: data?.user };
}

export async function signUp(formData: FormData) {
  // Extract raw input values from the form
  const rawData = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Validate email and password using RegisterSchema
  const credentialsValidation = RegisterSchema.safeParse({
    email: rawData.email,
    password: rawData.password,
  });

  if (!credentialsValidation.success) {
    return {
      status:
        credentialsValidation.error.errors[0]?.message || "Invalid credentials",
      user: null,
    };
  }

  // Validate the username using the reusable schema
  const usernameValidation = usernameSchema.safeParse(rawData.username);

  if (!usernameValidation.success) {
    return {
      status: usernameValidation.error.errors[0]?.message || "Invalid username",
      user: null,
    };
  }

  const supabase = await createClient();

  // Check if username is already taken
  const { data: existingUser } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("username", rawData.username)
    .maybeSingle();

  if (existingUser) {
    return {
      status: "Username already taken",
      user: null,
    };
  }

  // Attempt to sign up the user via Supabase
  const { error, data } = await supabase.auth.signUp({
    email: rawData.email,
    password: rawData.password,
    options: {
      data: { username: rawData.username },
    },
  });

  // Handle errors and existing email edge case
  if (error) {
    return { status: error.message, user: null };
  } else if (data?.user?.identities?.length === 0) {
    return {
      status: "User with this email already exists.",
      user: null,
    };
  }

  // Revalidate the root layout after sign-up
  revalidatePath("/", "layout");

  return { status: "success", user: data.user };
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const credentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error, data } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return { status: error.message, user: null };
  }

  // Prüfen ob user_profiles-Eintrag schon existiert
  const { data: existingUser, error: fetchError } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("email", credentials.email)
    .maybeSingle();

  if (fetchError) {
    return { status: fetchError.message, user: null };
  }

  if (!existingUser) {
    // optional: username bereinigen
    let baseUsername = data?.user?.user_metadata?.username ?? "user";
    baseUsername = baseUsername
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "")
      .slice(0, 20);

    let finalUsername = baseUsername;
    let usernameExists = true;

    while (usernameExists) {
      const { data: check } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("username", finalUsername)
        .maybeSingle();

      if (!check) {
        usernameExists = false;
      } else {
        finalUsername = `${baseUsername}-${Math.floor(
          1000 + Math.random() * 9000
        )}`;
      }
    }

    const { error: insertError } = await supabase.from("user_profiles").insert({
      email: credentials.email,
      username: finalUsername,
      user_id: data.user.id,
    });

    if (insertError) {
      return {
        status: insertError.message,
        user: null,
      };
    }
  }

  revalidatePath("/", "layout");

  return { status: "success", user: data.user };
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function signInWithGithub() {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect("/error");
  } else if (data?.url) {
    redirect(data.url);
  }
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  // Get the email from the formData
  const email = formData.get("email") as string;

  // Validate the email using Zod
  const emailValidation = EmailSchema.safeParse(email);

  if (!emailValidation.success) {
    return {
      status:
        emailValidation.error.errors[0]?.message || "Invalid email address",
    };
  }

  // If validation passed, proceed with the password reset request
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    return {
      status: error.message,
    };
  }

  return { status: "success" };
}

export async function resetPassword(formData: FormData, code: string) {
  const supabase = await createClient();

  // Validate the password using the schema
  const passwordValidation = PasswordSchema.safeParse(formData.get("password"));

  if (!passwordValidation.success) {
    return {
      status: passwordValidation.error.errors[0]?.message || "Invalid password",
    };
  }

  // Exchange code for session
  const { error: CodeError } = await supabase.auth.exchangeCodeForSession(code);

  if (CodeError) {
    return { status: CodeError?.message };
  }

  // Update the user’s password in Supabase
  const { error } = await supabase.auth.updateUser({
    password: formData.get("password") as string,
  });

  if (error) {
    return { status: error?.message };
  }

  return { status: "success" };
}

export async function changePassword(formData: FormData) {
  const supabase = await createClient();

  // Get the password from form data
  const password = formData.get("password") as string;

  // Validate the password using the schema
  const passwordValidation = PasswordSchema.safeParse(password);

  if (!passwordValidation.success) {
    return {
      status: passwordValidation.error.errors[0]?.message || "Invalid password",
    };
  }

  // Update the user's password in Supabase
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { status: error.message };
  }

  return { status: "success" };
}

export async function changeEmail(formData: FormData) {
  const supabase = await createClient();

  // Get the email from form data
  const email = formData.get("email") as string;

  // Validate the email using Zod
  const emailValidation = EmailSchema.safeParse(email);

  if (!emailValidation.success) {
    return {
      status:
        emailValidation.error.errors[0]?.message || "Invalid email address",
    };
  }

  // Update the user's email in Supabase
  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    return { status: error.message };
  }

  return { status: "success" };
}
