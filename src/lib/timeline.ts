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
    details: Record<string, unknown>;
};

export type ReactionRow = { hearted: boolean; reply: string | null };

const KINDS: TimelineKind[] = ["past", "milestone", "future"];
const MEDIA_KINDS = ["photo", "video", "audio", "link"];

export async function listTimeline(): Promise<DbEntry[]> {
    const sb = getSupabase();
    if (!sb) return [];
    const { data, error } = await sb
        .from("timeline")
        .select("id,date,title,note,kind,emoji,media,details")
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

const str = (v: unknown, max: number) =>
    v ? String(v).slice(0, max) : undefined;
const strArr = (v: unknown) =>
    Array.isArray(v)
        ? v.map((x) => String(x).trim()).filter(Boolean).slice(0, 40)
        : undefined;

function buildDetails(body: Record<string, unknown>) {
    const importanceNum = Number(body.importance);
    const songs = Array.isArray(body.songs)
        ? (body.songs as { title?: unknown; url?: unknown }[])
              .map((s) => ({
                  title: String(s?.title ?? "").slice(0, 140),
                  url: s?.url ? String(s.url).slice(0, 800) : undefined,
              }))
              .filter((s) => s.title || s.url)
              .slice(0, 25)
        : undefined;

    const orderNum = Number(body.timelineOrder);

    const MODES = ["Train", "Flight", "Car", "Bike", "Walk"];
    const t = (body.travel ?? {}) as Record<string, unknown>;
    const travel = {
        from: str(t.from, 120),
        to: str(t.to, 120),
        mode: MODES.includes(t.mode as string) ? (t.mode as string) : undefined,
        duration: str(t.duration, 60),
    };
    const hasTravel = travel.from || travel.to || travel.mode || travel.duration;

    const f = (body.feelings ?? {}) as Record<string, unknown>;
    const feelings = {
        samar: strArr(f.samar),
        krushi: strArr(f.krushi),
    };
    const hasFeelings = (feelings.samar?.length ?? 0) > 0 || (feelings.krushi?.length ?? 0) > 0;

    const details: Record<string, unknown> = {
        subtitle: str(body.subtitle, 200),
        hisMemory: str(body.hisMemory, 4000),
        herMemory: str(body.herMemory, 4000),
        funnyMoment: str(body.funnyMoment, 2000),
        favoriteQuote: str(body.favoriteQuote, 500),
        location: str(body.location, 200),
        weather: str(body.weather, 120),
        mood: str(body.mood, 120),
        map: str(body.map, 800),
        importance:
            Number.isFinite(importanceNum) && importanceNum > 0
                ? Math.min(5, Math.max(1, Math.round(importanceNum)))
                : undefined,
        relationshipStage: str(body.relationshipStage, 60),
        travel: hasTravel ? travel : undefined,
        gifts: strArr(body.gifts),
        feelings: hasFeelings ? feelings : undefined,
        firsts: strArr(body.firsts),
        timelineOrder: Number.isFinite(orderNum) ? orderNum : undefined,
        tags: strArr(body.tags),
        peoplePresent: strArr(body.peoplePresent),
        songs: songs && songs.length ? songs : undefined,
    };
    // drop undefined so the JSONB stays tidy
    for (const k of Object.keys(details)) if (details[k] === undefined) delete details[k];
    return details;
}

function sanitize(body: Record<string, unknown>) {
    const kind = KINDS.includes(body.kind as TimelineKind)
        ? (body.kind as TimelineKind)
        : "past";
    const media = Array.isArray(body.media)
        ? (body.media as MediaItem[])
              .filter((m) => m && typeof m.url === "string")
              .map((m) => ({
                  type: (MEDIA_KINDS.includes(m.type) ? m.type : "link") as MediaItem["type"],
                  url: String(m.url).slice(0, 2000),
                  caption: m.caption ? String(m.caption).slice(0, 200) : undefined,
              }))
        : [];
    return {
        date: String(body.date ?? "").slice(0, 10),
        title: String(body.title ?? "").trim().slice(0, 120),
        note: body.note ? String(body.note).slice(0, 4000) : null,
        kind,
        emoji: body.emoji ? String(body.emoji).slice(0, 8) : null,
        media,
        details: buildDetails(body),
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
