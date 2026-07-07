import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Assigns each device a stable, first-party httpOnly visitor id cookie on first
 * visit. Unlike localStorage / script-set cookies (which iOS Safari's ITP evicts
 * or partitions), a server-set httpOnly cookie persists and is shared across all
 * tabs — so treasure progress accumulates correctly, even when NFC opens each
 * link in a fresh tab.
 */
export function proxy(request: NextRequest) {
    const res = NextResponse.next();
    if (!request.cookies.get("vid")?.value) {
        res.cookies.set("vid", crypto.randomUUID(), {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 365 * 3, // 3 years
            secure: process.env.NODE_ENV === "production",
        });
    }
    return res;
}

export const config = {
    // run on page/app requests, skip Next internals & static asset files
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)"],
};
