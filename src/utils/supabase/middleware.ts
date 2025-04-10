import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  guestOnlyPages,
  privatePages,
  redirectBlockedProfile,
  redirectIfAuthenticated,
  redirectIfNotAuthenticated,
} from "./routes";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            (
              { name, value } // options
            ) => request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Routes Handling
  const path = request.nextUrl.pathname;

  const isPrivate =
    privatePages.some((page) => path.includes(page)) ||
    privatePages.includes(path);
  const isGuestOnly = guestOnlyPages.some((page) => path.includes(page));
  const isOnBlockedPage = path === redirectBlockedProfile;

  // Private Pages
  if (!user && isPrivate) {
    const url = request.nextUrl.clone();
    url.pathname = redirectIfNotAuthenticated;
    return NextResponse.redirect(url);
  }

  // Not Authenticated Pages but Open
  if (user && isGuestOnly) {
    const url = request.nextUrl.clone();
    url.pathname = redirectIfAuthenticated;
    return NextResponse.redirect(url);
  }

  // If user is logged in, check if they are blocked
  if (user && !isOnBlockedPage) {
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("is_blocked")
      .eq("user_id", user.id)
      .maybeSingle();

    const isBlocked = !!profile?.is_blocked;

    if (error || isBlocked) {
      const url = request.nextUrl.clone();
      url.pathname = redirectBlockedProfile;
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
