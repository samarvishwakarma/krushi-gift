"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import type { MediaItem, TimelineEntry, TimelineKind } from "@/data/timeline";
import {
    embedUrl,
    fmtLong,
    isFuture,
    looksLikeImage,
    looksLikeVideoFile,
} from "./helpers";

const KIND_ACCENT: Record<TimelineKind, string> = {
    past: "#b23b53",
    milestone: "#C07048",
    future: "#8a5a7a",
};

const KIND_LABEL: Record<TimelineKind, string> = {
    past: "a memory",
    milestone: "a milestone",
    future: "a dream",
};

export function MediaBlock({ item }: { item: MediaItem }) {
    const embed = item.type !== "photo" ? embedUrl(item.url) : null;

    let inner;
    if (embed) {
        inner = (
            <iframe
                src={embed}
                title={item.caption ?? "video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="aspect-video w-full"
            />
        );
    } else if (item.type === "video" || looksLikeVideoFile(item.url)) {
        // eslint-disable-next-line jsx-a11y/media-has-caption
        inner = <video src={item.url} controls className="w-full" />;
    } else if (item.type === "photo" || looksLikeImage(item.url)) {
        // eslint-disable-next-line @next/next/no-img-element
        inner = (
            <img
                src={item.url}
                alt={item.caption ?? ""}
                draggable={false}
                className="w-full object-cover"
            />
        );
    } else {
        inner = (
            <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-3 text-[#7a5a38] underline-offset-2 hover:underline"
            >
                🔗 <span className="truncate">{item.caption || item.url}</span>
            </a>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-[#eadcc0] bg-[#f6ecd8]">
            {inner}
            {item.caption && (item.type === "photo" || looksLikeImage(item.url)) && (
                <p className="px-2 py-1 text-center text-sm text-[#8a6f53]">{item.caption}</p>
            )}
        </div>
    );
}

export default function EntryCard({
    entry,
    hearted,
    editing,
    onHeart,
    onEdit,
    onDelete,
    compact = false,
    onOpen,
}: {
    entry: TimelineEntry;
    hearted: boolean;
    editing: boolean;
    onHeart: (id: string, next: boolean) => void;
    onEdit?: (entry: TimelineEntry) => void;
    onDelete?: (id: string) => void;
    /** Timeline preview: fixed-size media, clamped note, opens a detail popup. */
    compact?: boolean;
    onOpen?: () => void;
}) {
    const accent = KIND_ACCENT[entry.kind];
    const sealed = entry.kind === "future" && isFuture(entry.date);
    const canEdit = editing && entry.source === "db";
    const hasMedia = !sealed && Boolean(entry.media && entry.media.length > 0);
    const first = entry.media?.[0];
    const firstIsImage = first && (first.type === "photo" || looksLikeImage(first.url));

    return (
        <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            onClick={compact && onOpen ? onOpen : undefined}
            className={`relative overflow-hidden rounded-[16px] border border-[#e3cfa6] bg-[#fffaf0] shadow-[0_14px_40px_rgba(120,80,40,0.16)] ${compact && onOpen ? "cursor-pointer transition hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(120,80,40,0.22)]" : ""
                }`}
        >
            {/* media */}
            {hasMedia &&
                (compact ? (
                    <div className="w-full overflow-hidden bg-[#f6ecd8]">
                        {firstIsImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={first!.url}
                                alt=""
                                draggable={false}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <MediaBlock item={first!} />
                        )}
                        {entry.media!.length > 1 && (
                            <span className="absolute right-3 top-3 rounded-full bg-black/45 px-2 py-0.5 text-xs text-white">
                                +{entry.media!.length - 1}
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 border-b border-[#eadcc0] bg-[#f6ecd8] p-2">
                        {entry.media!.map((m, i) => (
                            <MediaBlock key={i} item={m} />
                        ))}
                    </div>
                ))}

            <div className="p-5">
                <div className="flex items-center justify-between">
                    <span
                        className="rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide text-white"
                        style={{ background: accent }}
                    >
                        {fmtLong(entry.date)}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-[#a98a63]">
                        {KIND_LABEL[entry.kind]}
                    </span>
                </div>

                <h3
                    className="mt-2 flex items-center gap-2 [font-family:var(--font-caveat)] text-3xl leading-none"
                    style={{ color: accent }}
                >
                    {entry.emoji && <span className="text-2xl leading-none">{entry.emoji}</span>}
                    <span>{entry.title}</span>
                </h3>

                {entry.subtitle && (
                    <p className="mt-1 text-sm italic text-[#a98a63]">{entry.subtitle}</p>
                )}

                {/* quick chips (both compact + detail) */}
                {!sealed && <QuickChips entry={entry} />}

                {sealed ? (
                    <div className="relative mt-3">
                        <p className="select-none blur-xs">
                            {entry.note || "a little secret, waiting for its day…"}
                        </p>
                        <div className="mt-3 rounded-xl border border-dashed border-[#cdb084] bg-[#fdf3df] p-4 text-center">
                            <div className="text-2xl">🔒</div>
                            <p className="[font-family:var(--font-caveat)] text-xl text-[#8a5a7a]">
                                sealed until {fmtLong(entry.date)}
                            </p>
                            <p className="text-sm text-[#8a6f53]">
                                some dreams are sweeter when you wait for them 🤍
                            </p>
                        </div>
                    </div>
                ) : (
                    entry.note && (
                        <p
                            className={`mt-2 whitespace-pre-line leading-relaxed text-[#5b4632] ${compact ? "line-clamp-3" : ""
                                }`}
                        >
                            {entry.note}
                        </p>
                    )
                )}

                {/* rich archive — full detail view only */}
                {!sealed && !compact && <RichDetails entry={entry} />}

                {/* footer */}
                <div className="mt-4 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onHeart(entry.id, !hearted);
                        }}
                        className="flex items-center gap-1 text-sm transition hover:scale-105"
                        style={{ color: hearted ? "#D6486A" : "#b9a084" }}
                        aria-label={hearted ? "Remove heart" : "Add heart"}
                    >
                        <span className="text-lg">{hearted ? "💗" : "🤍"}</span>
                        {hearted ? "loved" : "love this"}
                    </button>

                    {compact ? (
                        <span className="text-sm text-[#a98a63]">tap to open ↗</span>
                    ) : (
                        canEdit && (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => onEdit?.(entry)}
                                    className="rounded-full border border-[#e0cba2] px-3 py-1 text-sm text-[#8a6f53] hover:bg-[#f6ead2]"
                                >
                                    edit ✎
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete?.(entry.id)}
                                    className="rounded-full border border-[#e7b3bd] bg-[#fff0f2] px-3 py-1 text-sm text-[#b23b53]"
                                >
                                    remove 🗑
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/* Rich-detail pieces                                                  */
/* ------------------------------------------------------------------ */

function Chip({ children }: { children: ReactNode }) {
    return (
        <span className="rounded-full bg-[#f3e6d0] px-2.5 py-0.5 text-xs text-[#8a6f53]">
            {children}
        </span>
    );
}

function QuickChips({ entry }: { entry: TimelineEntry }) {
    if (!entry.relationshipStage && !entry.location && !entry.mood && !entry.importance)
        return null;
    return (
        <div className="mt-2 flex flex-wrap gap-1.5">
            {entry.relationshipStage && (
                <span className="rounded-full bg-[#b23b53] px-2.5 py-0.5 text-xs font-semibold text-white">
                    💞 {entry.relationshipStage}
                </span>
            )}
            {entry.location && <Chip>📍 {entry.location}</Chip>}
            {entry.mood && <Chip>🎭 {entry.mood}</Chip>}
            {entry.importance ? <Chip>{"★".repeat(entry.importance)}</Chip> : null}
        </div>
    );
}

function travelLine(t: NonNullable<TimelineEntry["travel"]>): string {
    const route = [t.from, t.to].filter(Boolean).join(" → ");
    return [route, t.mode, t.duration].filter(Boolean).join(" · ");
}

function MemoryCard({
    label,
    color,
    text,
}: {
    label: string;
    color: string;
    text: string;
}) {
    return (
        <div
            className="rounded-xl border p-3"
            style={{ borderColor: `${color}33`, background: `${color}0f` }}
        >
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color }}>
                {label}
            </p>
            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-[#5b4632]">
                {text}
            </p>
        </div>
    );
}

function RichDetails({ entry }: { entry: TimelineEntry }) {
    const hasMeta =
        entry.weather || (entry.peoplePresent?.length ?? 0) > 0 || (entry.tags?.length ?? 0) > 0;
    const hasSongs = (entry.songs?.length ?? 0) > 0;
    const hasFirsts = (entry.firsts?.length ?? 0) > 0;
    const hasGifts = (entry.gifts?.length ?? 0) > 0;
    const hasTravel =
        entry.travel && (entry.travel.from || entry.travel.to || entry.travel.mode || entry.travel.duration);
    const hasFeelings =
        (entry.feelings?.samar?.length ?? 0) > 0 || (entry.feelings?.krushi?.length ?? 0) > 0;

    if (
        !hasMeta &&
        !hasSongs &&
        !hasFirsts &&
        !hasGifts &&
        !hasTravel &&
        !hasFeelings &&
        !entry.hisMemory &&
        !entry.herMemory &&
        !entry.funnyMoment &&
        !entry.favoriteQuote &&
        !entry.map
    ) {
        return null;
    }

    return (
        <div className="mt-4 space-y-3">
            {hasTravel && (
                <div className="rounded-xl border border-[#eadcc0] bg-[#f6ecd8] p-3 text-sm text-[#5b4632]">
                    🚆 {travelLine(entry.travel!)}
                </div>
            )}

            {hasFirsts && (
                <div className="flex flex-wrap gap-1.5">
                    {entry.firsts!.map((f, i) => (
                        <span
                            key={i}
                            className="rounded-full bg-[#fbe7d2] px-2.5 py-0.5 text-xs font-semibold text-[#a05a3a]"
                        >
                            ⭐ {f}
                        </span>
                    ))}
                </div>
            )}

            {hasMeta && (
                <div className="flex flex-wrap gap-1.5">
                    {entry.weather && <Chip>🌤 {entry.weather}</Chip>}
                    {entry.peoplePresent?.map((p, i) => <Chip key={`p${i}`}>👤 {p}</Chip>)}
                    {entry.tags?.map((t, i) => <Chip key={`t${i}`}>#{t}</Chip>)}
                </div>
            )}

            {hasFeelings && (
                <div className="space-y-1 text-sm">
                    {(entry.feelings?.samar?.length ?? 0) > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[#b23b53]">Samar felt</span>
                            {entry.feelings!.samar!.map((w, i) => <Chip key={`s${i}`}>{w}</Chip>)}
                        </div>
                    )}
                    {(entry.feelings?.krushi?.length ?? 0) > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[#8a5a7a]">Krushi felt</span>
                            {entry.feelings!.krushi!.map((w, i) => <Chip key={`k${i}`}>{w}</Chip>)}
                        </div>
                    )}
                </div>
            )}

            {hasGifts && (
                <div className="flex flex-wrap gap-1.5">
                    {entry.gifts!.map((g, i) => (
                        <span
                            key={i}
                            className="rounded-full bg-[#f3e6d0] px-2.5 py-0.5 text-xs text-[#8a6f53]"
                        >
                            🎁 {g}
                        </span>
                    ))}
                </div>
            )}

            {(entry.hisMemory || entry.herMemory) && (
                <div className="grid gap-3 sm:grid-cols-2">
                    {entry.hisMemory && (
                        <MemoryCard label="what Samar felt ❤️" color="#b23b53" text={entry.hisMemory} />
                    )}
                    {entry.herMemory && (
                        <MemoryCard label="what Krushi felt ❤️" color="#8a5a7a" text={entry.herMemory} />
                    )}
                </div>
            )}

            {entry.funnyMoment && (
                <div className="rounded-xl bg-[#fdf3df] p-3 text-[#5b4632]">
                    <span className="mr-1">😄</span>
                    {entry.funnyMoment}
                </div>
            )}

            {entry.favoriteQuote && (
                <blockquote className="border-l-4 border-[#e0b0bd] pl-3 [font-family:var(--font-caveat)] text-2xl leading-snug text-[#7a5a38]">
                    “{entry.favoriteQuote}”
                </blockquote>
            )}

            {hasSongs && (
                <div>
                    <p className="text-xs uppercase tracking-widest text-[#a98a63]">
                        songs of the day
                    </p>
                    <ul className="mt-1 space-y-1 text-sm">
                        {entry.songs!.map((s, i) => (
                            <li key={i}>
                                🎵{" "}
                                {s.url ? (
                                    <a
                                        href={s.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[#b23b53] underline-offset-2 hover:underline"
                                    >
                                        {s.title || s.url}
                                    </a>
                                ) : (
                                    <span className="text-[#5b4632]">{s.title}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {entry.map && (
                <a
                    href={entry.map}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-[#f3e6d0] px-3 py-1 text-sm text-[#8a6f53] hover:bg-[#efd9b8]"
                >
                    📍 open the map
                </a>
            )}
        </div>
    );
}
