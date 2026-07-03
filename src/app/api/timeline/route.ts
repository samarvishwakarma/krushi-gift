import { NextResponse } from "next/server";
import { checkEditorSecret } from "@/lib/editor";
import { listTimeline, listReactions, addTimeline } from "@/lib/timeline";

export const runtime = "nodejs";

/** Public: user-added timeline entries + reactions map. */
export async function GET() {
    const [entries, reactions] = await Promise.all([listTimeline(), listReactions()]);
    return NextResponse.json({ entries, reactions });
}

/** Secret-gated: add a timeline entry. */
export async function POST(req: Request) {
    if (!checkEditorSecret(req)) {
        return NextResponse.json({ error: "Not allowed" }, { status: 401 });
    }
    const body = await req.json().catch(() => ({}));
    const result = await addTimeline(body ?? {});
    if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
}
