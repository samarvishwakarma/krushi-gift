"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { unlockTreasure } from "@/utils/progress";
import { useEditMode } from "@/components/edit/EditModeProvider";
import BackHomeButton from "@/components/BackHomeButton";
import MemoryUnlockOverlay from "@/components/MemoryUnlockOverlay";
import {
    ORIGIN_DATE,
    SEED_ENTRIES,
    type Feelings,
    type MediaItem,
    type Song,
    type TimelineEntry,
    type TimelineKind,
    type Travel,
} from "@/data/timeline";
import TimelineView from "./TimelineView";
import CalendarGridView from "./CalendarGridView";
import EntryEditorModal, { type EntryDraft } from "./EntryEditorModal";
import { daysSince, fmtLong, isOnThisDay, nextAnniversary, parseDate } from "./helpers";

type DbEntry = {
    id: string;
    date: string;
    title: string;
    note: string | null;
    kind: TimelineKind;
    emoji: string | null;
    media: MediaItem[];
    details?: Record<string, unknown> | null;
};

/** Flatten a DB row (with its `details` JSONB) into a rich TimelineEntry. */
function toEntry(e: DbEntry): TimelineEntry {
    const d = (e.details ?? {}) as Record<string, unknown>;
    const s = (v: unknown) => (typeof v === "string" ? v : undefined);
    const sa = (v: unknown) => (Array.isArray(v) ? (v as string[]) : undefined);
    return {
        id: e.id,
        date: e.date,
        title: e.title,
        kind: e.kind,
        source: "db",
        note: e.note ?? undefined,
        emoji: e.emoji ?? undefined,
        media: e.media ?? [],
        subtitle: s(d.subtitle),
        hisMemory: s(d.hisMemory),
        herMemory: s(d.herMemory),
        funnyMoment: s(d.funnyMoment),
        favoriteQuote: s(d.favoriteQuote),
        location: s(d.location),
        weather: s(d.weather),
        mood: s(d.mood),
        importance: typeof d.importance === "number" ? d.importance : undefined,
        map: s(d.map),
        relationshipStage: s(d.relationshipStage),
        travel: d.travel && typeof d.travel === "object" ? (d.travel as Travel) : undefined,
        gifts: sa(d.gifts),
        feelings:
            d.feelings && typeof d.feelings === "object" ? (d.feelings as Feelings) : undefined,
        firsts: sa(d.firsts),
        timelineOrder: typeof d.timelineOrder === "number" ? d.timelineOrder : undefined,
        tags: sa(d.tags),
        peoplePresent: sa(d.peoplePresent),
        songs: Array.isArray(d.songs) ? (d.songs as Song[]) : undefined,
    };
}

// deterministic starfield (no Math.random → no hydration mismatch)
const STARS = Array.from({ length: 44 }, (_, i) => ({
    left: (i * 37) % 100,
    top: (i * 53) % 100,
    size: 1 + (i % 3),
    delay: (i % 10) * 0.3,
}));

export default function CalendarExperience() {
    const { editing, editFetch } = useEditMode();
    const [dbEntries, setDbEntries] = useState<TimelineEntry[]>([]);
    const [reactions, setReactions] = useState<Record<string, { hearted: boolean }>>({});
    const [view, setView] = useState<"timeline" | "grid">("grid");
    const [mounted, setMounted] = useState(false);
    const [showUnlock, setShowUnlock] = useState(false);
    const [editor, setEditor] = useState<{
        open: boolean;
        mode: "add" | "edit";
        initial?: TimelineEntry;
    }>({ open: false, mode: "add" });

    useEffect(() => setMounted(true), []);

    // treasure unlock (this page replaces SecretPage for calendar)
    useEffect(() => {
        let active = true;
        unlockTreasure("calendar").then((isNew) => {
            if (active && isNew) setShowUnlock(true);
        });
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        fetch("/api/timeline")
            .then((r) => r.json())
            .then((d) => {
                if (Array.isArray(d?.entries)) {
                    setDbEntries((d.entries as DbEntry[]).map(toEntry));
                }
                if (d?.reactions) setReactions(d.reactions);
            })
            .catch(() => { });
    }, []);

    const entries = useMemo(
        () =>
            [...SEED_ENTRIES, ...dbEntries].sort((a, b) => {
                const byDate = parseDate(a.date).getTime() - parseDate(b.date).getTime();
                if (byDate !== 0) return byDate;
                return (a.timelineOrder ?? 0) - (b.timelineOrder ?? 0);
            }),
        [dbEntries],
    );

    const days = mounted ? daysSince(ORIGIN_DATE) : 0;
    const anniv = mounted ? nextAnniversary("2025-05-24") : null;
    const onThisDay = mounted ? entries.filter((e) => isOnThisDay(e.date)) : [];

    const onHeart = (id: string, next: boolean) => {
        setReactions((r) => ({ ...r, [id]: { hearted: next } }));
        fetch("/api/timeline/react", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: id, hearted: next }),
        }).catch(() => { });
    };

    const onDelete = async (id: string) => {
        const res = await editFetch(`/api/timeline/${id}`, { method: "DELETE" });
        if (res.ok) setDbEntries((p) => p.filter((e) => e.id !== id));
    };

    const saveEntry = async (draft: EntryDraft) => {
        if (editor.mode === "edit" && editor.initial?.id) {
            const res = await editFetch(`/api/timeline/${editor.initial.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(draft),
            });
            const d = await res.json().catch(() => null);
            if (res.ok && d?.entry) {
                const updated = toEntry(d.entry as DbEntry);
                setDbEntries((p) => p.map((e) => (e.id === updated.id ? updated : e)));
                setEditor({ open: false, mode: "add" });
            } else alert(d?.error || "Could not save.");
            return;
        }
        const res = await editFetch("/api/timeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(draft),
        });
        const d = await res.json().catch(() => null);
        if (res.ok && d?.entry) {
            const added = toEntry(d.entry as DbEntry);
            setDbEntries((p) => [...p, added]);
            setEditor({ open: false, mode: "add" });
        } else alert(d?.error || "Could not save.");
    };

    const openAdd = (dateStr?: string) =>
        setEditor({
            open: true,
            mode: "add",
            initial: dateStr
                ? { id: "", date: dateStr, title: "", kind: "past", source: "db" }
                : undefined,
        });

    return (
        <div className="relative min-h-screen [font-family:var(--font-patrick)] text-[#5b4632]">
            <BackHomeButton />
            <MemoryUnlockOverlay
                show={showUnlock}
                onFinish={() => setShowUnlock(false)}
                title="Our Story"
            />

            {/* ---- the dark, starless "before you" hero ---- */}
            <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden rounded-b-[40px] bg-[#0c0c12] px-6 text-center">
                {STARS.map((s, i) => (
                    <motion.span
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.15, 0.8, 0.15] }}
                        transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: s.delay }}
                    />
                ))}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative z-10"
                >
                    <p className="text-sm uppercase tracking-[0.35em] text-white/40">
                        before you
                    </p>
                    <h1 className="mt-3 [font-family:var(--font-caveat)] text-5xl leading-tight text-white/80 sm:text-6xl">
                        my sky had
                        <br />
                        no stars
                    </h1>
                    <p className="mx-auto mt-4 max-w-sm text-white/50">
                        everything was grey and quiet, until one day it wasn&apos;t.
                    </p>
                    <div className="mt-10 animate-bounce text-2xl text-white/50">↓</div>
                    <p className="mt-1 text-xs uppercase tracking-widest text-white/30">
                        scroll into the light
                    </p>
                </motion.div>
                {/* glow at the bottom → the bloom into color */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#f7e9ce] to-transparent" />
            </section>

            <main className="mx-auto max-w-3xl px-5 pb-24 pt-12">
                {/* origin + counters */}
                <div className="text-center">
                    <div className="text-4xl">✦</div>
                    <h2 className="mt-1 [font-family:var(--font-caveat)] text-5xl leading-none text-[#b23b53]">
                        Our Story
                    </h2>
                    <p className="mt-2 text-[#7a5a38]">
                        It began on {fmtLong(ORIGIN_DATE)} — the day my world found its
                        color.
                    </p>
                    {mounted && (
                        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
                            <span className="rounded-full border border-[#e3cfa6] bg-[#fffaf0] px-4 py-1.5 text-[#8a6f53]">
                                🌈 {days} days in color
                            </span>
                            {anniv && (
                                <span className="rounded-full border border-[#e3cfa6] bg-[#fffaf0] px-4 py-1.5 text-[#8a6f53]">
                                    💛 {anniv.inDays === 0 ? "happy anniversary!" : `${anniv.inDays} days to our anniversary`}
                                </span>
                            )}
                        </div>
                    )}
                    {onThisDay.length > 0 && (
                        <div className="mx-auto mt-3 max-w-md rounded-xl border border-dashed border-[#cdb084] bg-[#fdf3df] px-4 py-2 text-sm text-[#7a5a38]">
                            ✨ on this day: {onThisDay.map((e) => e.title).join(" · ")}
                        </div>
                    )}
                </div>

                {/* view toggle */}
                <div className="mt-8 flex justify-center">
                    <div className="inline-flex rounded-full border border-[#e0cba2] bg-[#fffaf0] p-1">
                        {(["grid", "timeline"] as const).map((v) => (
                            <button
                                key={v}
                                type="button"
                                onClick={() => setView(v)}
                                className={`rounded-full px-4 py-1.5 text-sm transition ${view === v ? "bg-[#b23b53] text-white" : "text-[#8a6f53]"
                                    }`}
                            >
                                {v === "timeline" ? "📜 Story" : "📅 Calendar"}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8">
                    {view === "timeline" ? (
                        <TimelineView
                            entries={entries}
                            reactions={reactions}
                            editing={editing}
                            onHeart={onHeart}
                            onEdit={(e) => setEditor({ open: true, mode: "edit", initial: e })}
                            onDelete={onDelete}
                            onAdd={() => openAdd()}
                        />
                    ) : (
                        <CalendarGridView
                            entries={entries}
                            reactions={reactions}
                            editing={editing}
                            onHeart={onHeart}
                            onEdit={(e) => setEditor({ open: true, mode: "edit", initial: e })}
                            onDelete={onDelete}
                            onAddDate={(d) => openAdd(d)}
                        />
                    )}
                </div>
            </main>

            <EntryEditorModal
                open={editor.open}
                mode={editor.mode}
                initial={editor.initial}
                onCancel={() => setEditor({ open: false, mode: "add" })}
                onSave={saveEntry}
            />
        </div>
    );
}
