import "server-only";

/**
 * Edit mode is gated by a single shared secret (EDITOR_SECRET env var). The
 * client sends it in the `x-editor-secret` header; the server compares it here.
 * Seed content (authored in code) is never editable — only DB-backed additions.
 */
export function checkEditorSecret(req: Request): boolean {
    const secret = process.env.EDITOR_SECRET;
    if (!secret) return false; // editing disabled until a secret is configured
    const provided = req.headers.get("x-editor-secret");
    return Boolean(provided) && provided === secret;
}
