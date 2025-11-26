import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";

// This is the primary middleware function that handles both authentication and authorization.
export async function middleware(req: NextRequest) {
  // 1. Create a response object to refresh the session cookie
  const res = NextResponse.next();

  // 2. Create a Supabase client configured to use the middleware's request and response
  const supabase = createMiddlewareClient({ req, res });

  // 3. Refresh the session (if expired) and get the current session
  // This step is crucial for keeping the session alive and accessible on the client side.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // --- Authorization Logic ---

  // Define the routes that require admin privileges
  const adminRoutes = ["/admin/go-live"];

  // Check if the current path is an admin route
  if (adminRoutes.some((p) => req.nextUrl.pathname.startsWith(p))) {
    // If no session, redirect to login
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Check the user's role from the database
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    // If there's an error or the role is not 'admin', redirect to a denied page or home
    if (error || data?.role !== "admin") {
      return NextResponse.redirect(new URL("/denied", req.url));
    }
  }

  // Return the response with the refreshed session cookies
  return res;
}

// Configuration to specify which paths the middleware should run on.
export const config = {
  matcher: [
    // Match all paths except for _next/static, _next/image, favicon.ico, and public files
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    // Explicitly include the admin path for clarity, although the above regex should cover it
    "/admin/:path*",
  ],
};
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: any) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const adminRoutes = ["/admin/go-live"];

  if (adminRoutes.some((p) => req.nextUrl.pathname.startsWith(p))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (data.role !== "admin") {
      return NextResponse.redirect(new URL("/denied", req.url));
    }
  }

  return res;
}
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.redirect("/");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};