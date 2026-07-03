import "server-only";
import { getSupabase } from "./supabase";
import type { MediaItem, TimelineKind } from "@/data/timeline";

export type DbEntry = {
    id: string;
    date: string;
    title: string;
    note: string | null;
    kind: TimelineKind;
    emoji: string | null;
    media: MediaItem[];
};

export type ReactionRow = { hearted: boolean; reply: string | null };

const KINDS: TimelineKind[] = ["past", "milestone", "future"];

export async function listTimeline(): Promise<DbEntry[]> {
    const sb = getSupabase();
    if (!sb) return [];
    const { data, error } = await sb
        .from("timeline")
        .select("id,date,title,note,kind,emoji,media")
        .order("date", { ascending: true });
    if (error) {
        console.error("listTimeline", error.message);
        return [];
    }
    return (data ?? []) as DbEntry[];
}

export async function listReactions(): Promise<Record<string, ReactionRow>> {
    const sb = getSupabase();
    if (!sb) return {};
    const { data, error } = await sb.from("reactions").select("entry_key,hearted,reply");
    if (error || !data) return {};
    const map: Record<string, ReactionRow> = {};
    for (const r of data) map[r.entry_key as string] = { hearted: r.hearted, reply: r.reply };
    return map;
}

function sanitize(body: Record<string, unknown>) {
    const kind = KINDS.includes(body.kind as TimelineKind)
        ? (body.kind as TimelineKind)
        : "past";
    const media = Array.isArray(body.media)
        ? (body.media as MediaItem[])
              .filter((m) => m && typeof m.url === "string")
              .map((m) => ({
                  type: (["photo", "video", "link"].includes(m.type) ? m.type : "link") as MediaItem["type"],
                  url: String(m.url).slice(0, 2000),
                  caption: m.caption ? String(m.caption).slice(0, 200) : undefined,
              }))
        : [];
    return {
        date: String(body.date ?? "").slice(0, 10),
        title: String(body.title ?? "").trim().slice(0, 120),
        note: body.note ? String(body.note).slice(0, 2000) : null,
        kind,
        emoji: body.emoji ? String(body.emoji).slice(0, 8) : null,
        media,
    };
}

export async function addTimeline(body: Record<string, unknown>) {
    const sb = getSupabase();
    if (!sb) return { error: "Not configured" as const };
    const row = sanitize(body);
    if (!row.date || !row.title) return { error: "date and title required" as const };
    const { data, error } = await sb.from("timeline").insert(row).select().single();
    if (error) return { error: error.message };
    return { entry: data as DbEntry };
}

export async function updateTimeline(id: string, body: Record<string, unknown>) {
    const sb = getSupabase();
    if (!sb) return { error: "Not configured" as const };
    const row = sanitize(body);
    const { data, error } = await sb
        .from("timeline")
        .update(row)
        .eq("id", id)
        .select()
        .single();
    if (error) return { error: error.message };
    return { entry: data as DbEntry };
}

export async function removeTimeline(id: string) {
    const sb = getSupabase();
    if (!sb) return { error: "Not configured" as const };
    const { error } = await sb.from("timeline").delete().eq("id", id);
    if (error) return { error: error.message };
    return { ok: true as const };
}

export async function setReaction(
    key: string,
    patch: { hearted?: boolean; reply?: string | null },
) {
    const sb = getSupabase();
    if (!sb) return { error: "Not configured" as const };
    const row: Record<string, unknown> = { entry_key: key, updated_at: new Date().toISOString() };
    if (typeof patch.hearted === "boolean") row.hearted = patch.hearted;
    if (patch.reply !== undefined) row.reply = patch.reply;
    const { data, error } = await sb
        .from("reactions")
        .upsert(row, { onConflict: "entry_key" })
        .select()
        .single();
    if (error) return { error: error.message };
    return { reaction: data };
}
