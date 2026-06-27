import { NextResponse } from "next/server";
import { isPage, verifyPassword, tokenFor, cookieName } from "@/lib/gate";

export const runtime = "nodejs";

/** Verify a page's password and, on success, set its httpOnly unlock cookie. */
export async function POST(req: Request) {
    const body = await req.json().catch(() => null);
    const page = String(body?.page ?? "");
    const password = String(body?.password ?? "");

    if (!isPage(page)) {
        return NextResponse.json({ error: "Unknown page" }, { status: 404 });
    }
    if (!verifyPassword(page, password)) {
        return NextResponse.json({ ok: false }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(cookieName(page), tokenFor(page), {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        secure: process.env.NODE_ENV === "production",
    });
    return res;
}
