import { NextResponse } from "next/server";
import { checkEditorSecret } from "@/lib/editor";

export const runtime = "nodejs";

/** Verify the editor secret (used by the unlock prompt). */
export async function GET(req: Request) {
    if (!checkEditorSecret(req)) {
        return NextResponse.json({ ok: false }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
}
