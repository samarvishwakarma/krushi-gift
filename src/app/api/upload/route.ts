import { NextResponse } from "next/server";
import { getSupabase, MEDIA_BUCKET } from "@/lib/supabase";
import { checkEditorSecret } from "@/lib/editor";

export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

/** Secret-gated upload → Supabase Storage. Returns the public URL. */
export async function POST(req: Request) {
    if (!checkEditorSecret(req)) {
        return NextResponse.json({ error: "Not allowed" }, { status: 401 });
    }
    const sb = getSupabase();
    if (!sb) {
        return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
    }

    const form = await req.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") ?? "misc").replace(/[^a-z0-9/_-]/gi, "");

    if (!(file instanceof File)) {
        return NextResponse.json({ error: "No file" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: "File too large (max 15 MB)" }, { status: 413 });
    }

    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const name = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error } = await sb.storage
        .from(MEDIA_BUCKET)
        .upload(name, file, { contentType: file.type, upsert: false });
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = sb.storage.from(MEDIA_BUCKET).getPublicUrl(name);
    return NextResponse.json({ url: data.publicUrl, path: name });
}
