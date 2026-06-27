import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { checkEditorSecret } from "@/lib/editor";

export const runtime = "nodejs";

const KINDS = ["home", "place", "food", "heart"];

/** Secret-gated: edit a pin. */
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    if (!checkEditorSecret(req)) {
        return NextResponse.json({ error: "Not allowed" }, { status: 401 });
    }
    const sb = getSupabase();
    if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503 });

    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Bad body" }, { status: 400 });

    const patch: Record<string, unknown> = {};
    if (typeof body.name === "string") patch.name = body.name.trim().slice(0, 80);
    if (typeof body.note === "string") patch.note = body.note.slice(0, 300);
    if (KINDS.includes(body.kind)) patch.kind = body.kind;
    if (typeof body.emoji === "string") patch.emoji = body.emoji.slice(0, 8);
    if (Number.isFinite(Number(body.lat))) patch.lat = Number(body.lat);
    if (Number.isFinite(Number(body.lon))) patch.lon = Number(body.lon);
    if (typeof body.photo_url === "string" || body.photo_url === null)
        patch.photo_url = body.photo_url;

    const { data, error } = await sb
        .from("pins")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ pin: data });
}

/** Secret-gated: delete a pin. */
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    if (!checkEditorSecret(req)) {
        return NextResponse.json({ error: "Not allowed" }, { status: 401 });
    }
    const sb = getSupabase();
    if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503 });

    const { id } = await params;
    const { error } = await sb.from("pins").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}
