import "server-only";
import crypto from "node:crypto";

/**
 * Per-page password gate for people who reach a page WITHOUT its secret NFC
 * UID. The UID routes (e.g. /navsari/b8k1p4) stay open; the clean routes
 * (e.g. /navsari) require the page's password.
 *
 * Passwords live in the PAGE_PASSWORDS env var as JSON, e.g.
 *   PAGE_PASSWORDS={"navsari":"our first chai","morse":"dot dash"}
 */

export const PAGES = {
    navsari: { uid: "/navsari/b8k1p4", title: "Navsari" },
    landour: { uid: "/landour/l9f2a7", title: "Landour" },
    morse: { uid: "/morse/c7x9q1", title: "Morse Code" },
    "random-day": { uid: "/random-day/f2m8z5", title: "A Random Day" },
    calendar: { uid: "/calendar/k9r4w2", title: "Our Calendar" },
    "miss-me": { uid: "/miss-me/p8d4x7", title: "Open When You Miss Me" },
    homesick: { uid: "/homesick/m3z7k1", title: "Open When You're Homesick" },
    truce: { uid: "/truce/h5v2q9", title: "Truce" },
    "found-one": { uid: "/found-one/j8w6n3", title: "Treasure Found" },
    "final-secret": { uid: "/final-secret/x4r7t2", title: "The Final Secret" },
} as const;

export type PageId = keyof typeof PAGES;

export function isPage(id: string): id is PageId {
    return Object.prototype.hasOwnProperty.call(PAGES, id);
}

function passwordMap(): Record<string, string> {
    try {
        const parsed = JSON.parse(process.env.PAGE_PASSWORDS || "{}");
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        return {};
    }
}

export function verifyPassword(id: string, password: string): boolean {
    const expected = passwordMap()[id];
    if (!expected) return false;
    return password.trim().toLowerCase() === String(expected).trim().toLowerCase();
}

const SECRET =
    process.env.GATE_SECRET || process.env.EDITOR_SECRET || "krushi-gift-gate";

export function cookieName(id: string): string {
    return `g_${id.replace(/[^a-z0-9_-]/gi, "")}`;
}

export function tokenFor(id: string): string {
    return crypto.createHmac("sha256", SECRET).update(id).digest("hex").slice(0, 32);
}

export function isUnlocked(id: string, cookieValue: string | undefined): boolean {
    return Boolean(cookieValue) && cookieValue === tokenFor(id);
}
