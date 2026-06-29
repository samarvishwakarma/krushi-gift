import { NextResponse } from "next/server";
import { isPage } from "@/lib/gate";
import { isSupabaseConfigured } from "@/lib/supabase";
import { listProgress, addProgress } from "@/lib/progress";

export const runtime = "nodejs";

function visitorOf(req: Request): string {
    return (req.headers.get("x-visitor-id") || "").slice(0, 64);
}

/** Pages discovered by THIS visitor (per-device, not shared). */
export async function GET(req: Request) {
    const visitor = visitorOf(req);
    if (!visitor) return NextResponse.json({ unlocked: [] });
    return NextResponse.json({ unlocked: await listProgress(visitor) });
}

/** Mark a page discovered for this visitor. */
export async function POST(req: Request) {
    if (!isSupabaseConfigured()) {
        return NextResponse.json({ configured: false }, { status: 503 });
    }
    const visitor = visitorOf(req);
    if (!visitor) {
        return NextResponse.json({ error: "No visitor id" }, { status: 400 });
    }
    const body = await req.json().catch(() => null);
    const id = String(body?.id ?? "");
    if (!isPage(id)) {
        return NextResponse.json({ error: "Unknown page" }, { status: 400 });
    }
    return NextResponse.json(await addProgress(visitor, id));
}
