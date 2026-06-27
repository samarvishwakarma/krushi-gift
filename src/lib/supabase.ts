import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client (service role). Returns null when the project
 * isn't configured yet, so the site builds and runs with seed content only
 * until the env vars are added.
 *
 * Required env vars (see SETUP.md / .env.example):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
export const MEDIA_BUCKET = "media";

let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
    if (cached !== undefined) return cached;

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    cached = url && key
        ? createClient(url, key, { auth: { persistSession: false } })
        : null;

    return cached;
}

export function isSupabaseConfigured(): boolean {
    return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
