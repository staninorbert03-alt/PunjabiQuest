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