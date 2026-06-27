import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { checkEditorSecret } from "@/lib/editor";
import { listMedia } from "@/lib/pins";

export const runtime = "nodejs";

/** Public: list user-added media for a page (?page=navsari). */
export async function GET(req: Request) {
    const page = new URL(req.url).searchParams.get("page") ?? "";
    if (!page) return NextResponse.json({ media: [] });
    return NextResponse.json({ media: await listMedia(page) });
}

/** Secret-gated: add a media record (after the file is uploaded via /api/upload). */
export async function POST(req: Request) {
    if (!checkEditorSecret(req)) {
        return NextResponse.json({ error: "Not allowed" }, { status: 401 });
    }
    const sb = getSupabase();
    if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503 });

    const body = await req.json().catch(() => null);
    const page = String(body?.page ?? "").trim();
    const type = body?.type;
    const url = String(body?.url ?? "").trim();
    if (!page || (type !== "photo" && type !== "audio") || !url) {
        return NextResponse.json({ error: "page, type, url required" }, { status: 400 });
    }

    const row = {
        page,
        type,
        url,
        caption: body?.caption ? String(body.caption).slice(0, 200) : null,
        sort: Number.isFinite(Number(body?.sort)) ? Number(body.sort) : 0,
    };

    const { data, error } = await sb.from("media").insert(row).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ media: data });
}
