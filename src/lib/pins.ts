import "server-only";
import { getSupabase } from "./supabase";

export type DbPin = {
    id: string;
    page: string;
    name: string;
    note: string | null;
    lat: number;
    lon: number;
    kind: string;
    emoji: string | null;
    photo_url: string | null;
};

/** Reads user-added pins for a page. Returns [] when Supabase isn't configured. */
export async function listPins(page: string): Promise<DbPin[]> {
    const sb = getSupabase();
    if (!sb) return [];
    const { data, error } = await sb
        .from("pins")
        .select("id,page,name,note,lat,lon,kind,emoji,photo_url")
        .eq("page", page)
        .order("created_at", { ascending: true });
    if (error) {
        console.error("listPins error", error.message);
        return [];
    }
    return (data ?? []) as DbPin[];
}

export type DbMedia = {
    id: string;
    page: string;
    type: "photo" | "audio";
    url: string;
    caption: string | null;
    sort: number;
};

/** Reads user-added media for a page. Returns [] when Supabase isn't configured. */
export async function listMedia(page: string): Promise<DbMedia[]> {
    const sb = getSupabase();
    if (!sb) return [];
    const { data, error } = await sb
        .from("media")
        .select("id,page,type,url,caption,sort")
        .eq("page", page)
        .order("sort", { ascending: true })
        .order("created_at", { ascending: true });
    if (error) {
        console.error("listMedia error", error.message);
        return [];
    }
    return (data ?? []) as DbMedia[];
}
