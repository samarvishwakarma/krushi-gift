import { NextResponse } from "next/server";
import { getSupabase, MEDIA_BUCKET } from "@/lib/supabase";
import { checkEditorSecret } from "@/lib/editor";

export const runtime = "nodejs";

/** Secret-gated: update a media record's sort order or caption. */
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
    const patch: Record<string, unknown> = {};
    if (Number.isFinite(Number(body?.sort))) patch.sort = Number(body.sort);
    if (typeof body?.caption === "string") patch.caption = body.caption.slice(0, 200);
    if (Object.keys(patch).length === 0) {
        return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const { data, error } = await sb
        .from("media")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ media: data });
}

/** Secret-gated: delete a media record (and best-effort its stored file). */
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

    // Best-effort: remove the underlying storage object too.
    const { data: row } = await sb.from("media").select("url").eq("id", id).single();
    if (row?.url) {
        const marker = `/${MEDIA_BUCKET}/`;
        const idx = (row.url as string).indexOf(marker);
        if (idx !== -1) {
            const path = (row.url as string).slice(idx + marker.length);
            await sb.storage.from(MEDIA_BUCKET).remove([path]);
        }
    }

    const { error } = await sb.from("media").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}
