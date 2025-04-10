// Always Public Pages
export const publicPages = [
  "/",
  "error",
  "not-found",
  "/legal",
  "/posts",
  "/users",
];
export const publicAuthPagess = ["/auth", "/callback", "/confirm"];
export const auth = "/auth";

// Only not authenticated
export const guestOnlyPages = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// Only authenticated
export const privatePages = ["/settings"];

// Redirects
export const redirectIfNotAuthenticated = "/login";
export const redirectIfAuthenticated = "/";

// Blocked User
export const redirectBlockedProfile = "/auth/blocked";
export const blockedPathsToAllow = ["/api/auth/logout", "/logout"];
