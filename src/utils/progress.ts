const STORAGE_KEY = "unlocked";
const VISITOR_KEY = "vid";

function readCookie(name: string): string {
    if (typeof document === "undefined") return "";
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : "";
}

/**
 * A stable per-browser anonymous id. Stored in BOTH localStorage and a
 * 1-year cookie so it survives deploys and the occasional storage clear.
 * Keeps each device's discovery progress private (your testing ≠ Krushi's).
 */
function getVisitorId(): string {
    if (typeof window === "undefined") return "";
    let id = localStorage.getItem(VISITOR_KEY) || readCookie(VISITOR_KEY);
    if (!id) {
        id =
            typeof crypto !== "undefined" && crypto.randomUUID
                ? crypto.randomUUID()
                : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    }
    try {
        localStorage.setItem(VISITOR_KEY, id);
    } catch {
        /* ignore */
    }
    document.cookie = `${VISITOR_KEY}=${encodeURIComponent(id)};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    return id;
}

function readLocal(): string[] {
    if (typeof window === "undefined") return [];
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? (JSON.parse(data) as string[]) : [];
    } catch {
        return [];
    }
}

function writeLocal(list: string[]): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
        /* ignore */
    }
}

/**
 * Discovered treasures, shared across devices via Supabase (with a
 * localStorage fallback/mirror so it still works offline / unconfigured).
 */
export async function getUnlockedTreasures(): Promise<string[]> {
    try {
        const res = await fetch("/api/progress", {
            cache: "no-store",
            headers: { "x-visitor-id": getVisitorId() },
        });
        if (res.ok) {
            const d = await res.json();
            if (Array.isArray(d?.unlocked)) {
                const merged = Array.from(new Set([...d.unlocked, ...readLocal()]));
                writeLocal(merged);
                return merged;
            }
        }
    } catch {
        /* fall back to local */
    }
    return readLocal();
}

/** Synchronous best-effort check from the local mirror. */
export function isTreasureUnlocked(id: string): boolean {
    return readLocal().includes(id);
}

/** Mark a treasure discovered. Resolves to whether it was newly unlocked. */
export async function unlockTreasure(id: string): Promise<boolean> {
    const local = readLocal();
    const wasLocal = local.includes(id);
    if (!wasLocal) writeLocal([...local, id]);

    try {
        const res = await fetch("/api/progress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-visitor-id": getVisitorId(),
            },
            body: JSON.stringify({ id }),
        });
        if (res.ok) {
            const d = await res.json();
            return Boolean(d?.isNew);
        }
    } catch {
        /* server unavailable — use local result */
    }
    return !wasLocal;
}
