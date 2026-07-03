export function parseDate(s: string): Date {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
}

export function startOfToday(): Date {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

export function isFuture(dateStr: string): boolean {
    return parseDate(dateStr).getTime() > startOfToday().getTime();
}

export function fmtLong(dateStr: string): string {
    return parseDate(dateStr).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export function fmtShort(dateStr: string): string {
    return parseDate(dateStr).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
    });
}

export function daysBetween(a: Date, b: Date): number {
    return Math.round((b.getTime() - a.getTime()) / 86400000);
}

/** Days since a YYYY-MM-DD (0 if in the future). */
export function daysSince(dateStr: string): number {
    return Math.max(0, daysBetween(parseDate(dateStr), startOfToday()));
}

/** Next anniversary of a date and days until it. */
export function nextAnniversary(dateStr: string): { date: Date; inDays: number } {
    const base = parseDate(dateStr);
    const today = startOfToday();
    let next = new Date(today.getFullYear(), base.getMonth(), base.getDate());
    if (next.getTime() < today.getTime()) {
        next = new Date(today.getFullYear() + 1, base.getMonth(), base.getDate());
    }
    return { date: next, inDays: daysBetween(today, next) };
}

/** True if the date's month+day matches today (any year). */
export function isOnThisDay(dateStr: string): boolean {
    const d = parseDate(dateStr);
    const t = startOfToday();
    return d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

const KEY = "krushi";
export function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

/** youtube/vimeo → embeddable iframe src, else null. */
export function embedUrl(url: string): string | null {
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vim = url.match(/vimeo\.com\/(\d+)/);
    if (vim) return `https://player.vimeo.com/video/${vim[1]}`;
    return null;
}

export function looksLikeImage(url: string): boolean {
    return /\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/i.test(url);
}

export function looksLikeVideoFile(url: string): boolean {
    return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
}

export { KEY };
