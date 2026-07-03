import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { setReaction } from "@/lib/timeline";

export const runtime = "nodejs";

/** Open: heart / reply to an entry (reaching the page already required a gate). */
export async function POST(req: Request) {
    if (!isSupabaseConfigured()) {
        return NextResponse.json({ configured: false }, { status: 503 });
    }
    const body = await req.json().catch(() => null);
    const key = String(body?.key ?? "").slice(0, 80);
    if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

    const patch: { hearted?: boolean; reply?: string | null } = {};
    if (typeof body?.hearted === "boolean") patch.hearted = body.hearted;
    if (typeof body?.reply === "string") patch.reply = body.reply.slice(0, 500);

    const result = await setReaction(key, patch);
    if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
}
