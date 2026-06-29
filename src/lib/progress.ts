import "server-only";
import { getSupabase } from "./supabase";

/** Pages discovered by a given visitor. [] when unconfigured / no visitor. */
export async function listProgress(visitor: string): Promise<string[]> {
    const sb = getSupabase();
    if (!sb || !visitor) return [];
    const { data, error } = await sb
        .from("progress")
        .select("page")
        .eq("visitor", visitor);
    if (error) {
        console.error("listProgress error", error.message);
        return [];
    }
    return (data ?? []).map((r) => r.page as string);
}

/** Mark a page discovered for this visitor. Returns whether it was new. */
export async function addProgress(
    visitor: string,
    page: string,
): Promise<{ isNew: boolean }> {
    const sb = getSupabase();
    if (!sb || !visitor) return { isNew: false };

    const { data: existing } = await sb
        .from("progress")
        .select("page")
        .eq("visitor", visitor)
        .eq("page", page)
        .maybeSingle();
    if (existing) return { isNew: false };

    const { error } = await sb.from("progress").insert({ visitor, page });
    if (error) return { isNew: false };
    return { isNew: true };
}
