import { NextResponse } from "next/server";
import { checkEditorSecret } from "@/lib/editor";
import { updateTimeline, removeTimeline } from "@/lib/timeline";

export const runtime = "nodejs";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    if (!checkEditorSecret(req)) {
        return NextResponse.json({ error: "Not allowed" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const result = await updateTimeline(id, body ?? {});
    if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    if (!checkEditorSecret(req)) {
        return NextResponse.json({ error: "Not allowed" }, { status: 401 });
    }
    const { id } = await params;
    const result = await removeTimeline(id);
    if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
}
