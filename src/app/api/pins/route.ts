import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { checkEditorSecret } from "@/lib/editor";
import { listPins } from "@/lib/pins";

export const runtime = "nodejs";

const KINDS = ["home", "place", "food", "heart"];

/** Public: list user-added pins for a page (?page=navsari). */
export async function GET(req: Request) {
    const page = new URL(req.url).searchParams.get("page") ?? "navsari";
    return NextResponse.json({ pins: await listPins(page) });
}

/** Secret-gated: add a pin. */
export async function POST(req: Request) {
    if (!checkEditorSecret(req)) {
        return NextResponse.json({ error: "Not allowed" }, { status: 401 });
    }
    const sb = getSupabase();
    if (!sb) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const body = await req.json().catch(() => null);
    const lat = Number(body?.lat);
    const lon = Number(body?.lon);
    const name = String(body?.name ?? "").trim();
    if (!name || !Number.isFinite(lat) || !Number.isFinite(lon)) {
        return NextResponse.json({ error: "name, lat, lon required" }, { status: 400 });
    }

    const row = {
        page: String(body?.page ?? "navsari"),
        name: name.slice(0, 80),
        note: body?.note ? String(body.note).slice(0, 300) : null,
        lat,
        lon,
        kind: KINDS.includes(body?.kind) ? body.kind : "place",
        emoji: body?.emoji ? String(body.emoji).slice(0, 8) : null,
        photo_url: body?.photo_url ? String(body.photo_url) : null,
    };

    const { data, error } = await sb.from("pins").insert(row).select().single();
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ pin: data });
}
