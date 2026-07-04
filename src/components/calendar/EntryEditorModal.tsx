"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEditMode } from "@/components/edit/EditModeProvider";
import type {
    Feelings,
    MediaItem,
    Song,
    TimelineEntry,
    TimelineKind,
    Travel,
    TravelMode,
} from "@/data/timeline";

export type EntryDraft = {
    date: string;
    title: string;
    note: string;
    kind: TimelineKind;
    emoji: string;
    media: MediaItem[];
    subtitle?: string;
    hisMemory?: string;
    herMemory?: string;
    funnyMoment?: string;
    favoriteQuote?: string;
    location?: string;
    weather?: string;
    mood?: string;
    map?: string;
    importance?: number;
    relationshipStage?: string;
    travel?: Travel;
    gifts?: string[];
    feelings?: Feelings;
    firsts?: string[];
    timelineOrder?: number;
    tags?: string[];
    peoplePresent?: string[];
    songs?: Song[];
};

const STAGES = [
    "Strangers",
    "Friends",
    "Best Friends",
    "Situationship",
    "Couple",
    "Long Distance",
];
const MODES: TravelMode[] = ["Train", "Flight", "Car", "Bike", "Walk"];

const splitList = (s: string) =>
    s.split(",").map((x) => x.trim()).filter(Boolean);

const parseSongs = (s: string): Song[] =>
    s
        .split("\n")
        .map((line) => {
            const [t, ...rest] = line.split("|");
            const title = t.trim();
            const url = rest.join("|").trim();
            return { title, url: url || undefined };
        })
        .filter((x) => x.title || x.url);

const inputCls =
    "mt-1 w-full rounded-lg border border-[#e0cba2] bg-white px-3 py-2 outline-none";

export default function EntryEditorModal({
    open,
    mode,
    initial,
    onCancel,
    onSave,
}: {
    open: boolean;
    mode: "add" | "edit";
    initial?: TimelineEntry;
    onCancel: () => void;
    onSave: (draft: EntryDraft) => Promise<void>;
}) {
    const { editFetch } = useEditMode();
    const [date, setDate] = useState("");
    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [kind, setKind] = useState<TimelineKind>("past");
    const [emoji, setEmoji] = useState("");
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [linkUrl, setLinkUrl] = useState("");
    const [busy, setBusy] = useState(false);
    const [more, setMore] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    // rich fields kept as text; arrays/songs parsed on save
    const [d, setD] = useState<Record<string, string>>({});
    const [importance, setImportance] = useState(0);
    const set = (k: string, v: string) => setD((p) => ({ ...p, [k]: v }));

    useEffect(() => {
        if (!open) return;
        setDate(initial?.date ?? "");
        setTitle(initial?.title ?? "");
        setNote(initial?.note ?? "");
        setKind(initial?.kind ?? "past");
        setEmoji(initial?.emoji ?? "");
        setMedia(initial?.media ?? []);
        setLinkUrl("");
        setImportance(initial?.importance ?? 0);
        setD({
            subtitle: initial?.subtitle ?? "",
            hisMemory: initial?.hisMemory ?? "",
            herMemory: initial?.herMemory ?? "",
            funnyMoment: initial?.funnyMoment ?? "",
            favoriteQuote: initial?.favoriteQuote ?? "",
            location: initial?.location ?? "",
            weather: initial?.weather ?? "",
            mood: initial?.mood ?? "",
            map: initial?.map ?? "",
            tags: (initial?.tags ?? []).join(", "),
            peoplePresent: (initial?.peoplePresent ?? []).join(", "),
            songs: (initial?.songs ?? [])
                .map((s) => (s.url ? `${s.title} | ${s.url}` : s.title))
                .join("\n"),
            relationshipStage: initial?.relationshipStage ?? "",
            gifts: (initial?.gifts ?? []).join(", "),
            firsts: (initial?.firsts ?? []).join(", "),
            feelingsSamar: (initial?.feelings?.samar ?? []).join(", "),
            feelingsKrushi: (initial?.feelings?.krushi ?? []).join(", "),
            travelFrom: initial?.travel?.from ?? "",
            travelTo: initial?.travel?.to ?? "",
            travelMode: initial?.travel?.mode ?? "",
            travelDuration: initial?.travel?.duration ?? "",
            timelineOrder:
                initial?.timelineOrder != null ? String(initial.timelineOrder) : "",
        });
        setMore(
            Boolean(
                initial &&
                    (initial.hisMemory ||
                        initial.herMemory ||
                        initial.location ||
                        initial.songs?.length ||
                        initial.favoriteQuote),
            ),
        );
    }, [open, initial]);

    const uploadFiles = async (files: FileList | null) => {
        if (!files?.length) return;
        setBusy(true);
        try {
            for (const file of Array.from(files)) {
                const fd = new FormData();
                fd.append("file", file);
                fd.append("folder", "calendar");
                const res = await editFetch("/api/upload", { method: "POST", body: fd });
                const j = await res.json().catch(() => null);
                if (res.ok && j?.url) {
                    const type = file.type.startsWith("video")
                        ? "video"
                        : file.type.startsWith("audio")
                          ? "audio"
                          : "photo";
                    setMedia((m) => [...m, { type, url: j.url }]);
                } else {
                    alert(j?.error || "Upload failed");
                }
            }
        } finally {
            setBusy(false);
        }
    };

    const addLink = () => {
        const url = linkUrl.trim();
        if (!url) return;
        setMedia((m) => [...m, { type: "link", url }]);
        setLinkUrl("");
    };

    const save = async () => {
        if (!date || !title.trim()) return;
        setBusy(true);
        await onSave({
            date,
            title: title.trim(),
            note: note.trim(),
            kind,
            emoji: emoji.trim(),
            media,
            subtitle: d.subtitle?.trim() || undefined,
            hisMemory: d.hisMemory?.trim() || undefined,
            herMemory: d.herMemory?.trim() || undefined,
            funnyMoment: d.funnyMoment?.trim() || undefined,
            favoriteQuote: d.favoriteQuote?.trim() || undefined,
            location: d.location?.trim() || undefined,
            weather: d.weather?.trim() || undefined,
            mood: d.mood?.trim() || undefined,
            map: d.map?.trim() || undefined,
            importance: importance || undefined,
            relationshipStage: d.relationshipStage?.trim() || undefined,
            gifts: d.gifts ? splitList(d.gifts) : undefined,
            firsts: d.firsts ? splitList(d.firsts) : undefined,
            feelings:
                d.feelingsSamar || d.feelingsKrushi
                    ? {
                          samar: d.feelingsSamar ? splitList(d.feelingsSamar) : undefined,
                          krushi: d.feelingsKrushi ? splitList(d.feelingsKrushi) : undefined,
                      }
                    : undefined,
            travel:
                d.travelFrom || d.travelTo || d.travelMode || d.travelDuration
                    ? {
                          from: d.travelFrom?.trim() || undefined,
                          to: d.travelTo?.trim() || undefined,
                          mode: (d.travelMode as TravelMode) || undefined,
                          duration: d.travelDuration?.trim() || undefined,
                      }
                    : undefined,
            timelineOrder: d.timelineOrder ? Number(d.timelineOrder) : undefined,
            tags: d.tags ? splitList(d.tags) : undefined,
            peoplePresent: d.peoplePresent ? splitList(d.peoplePresent) : undefined,
            songs: d.songs ? parseSongs(d.songs) : undefined,
        });
        setBusy(false);
    };

    const mediaIcon = (t: MediaItem["type"]) =>
        t === "photo" ? "📷" : t === "video" ? "🎬" : t === "audio" ? "🎵" : "🔗";

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-110 flex items-start justify-center overflow-y-auto bg-[#3a2417]/50 p-4 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onCancel}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.92, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="my-8 w-full max-w-md rounded-2xl border border-[#e7d4b0] bg-[#fffaf0] p-6 shadow-[0_18px_50px_rgba(120,70,30,0.35)]"
                    >
                        <h2 className="text-center [font-family:var(--font-caveat)] text-3xl text-[#b23b53]">
                            {mode === "edit" ? "Edit this day" : "Add a day to our story"}
                        </h2>

                        <div className="mt-4 flex gap-3">
                            <div className="flex-1">
                                <label className="block text-sm text-[#8a6f53]">Date</label>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
                            </div>
                            <div className="w-32">
                                <label className="block text-sm text-[#8a6f53]">Type</label>
                                <select value={kind} onChange={(e) => setKind(e.target.value as TimelineKind)} className={inputCls}>
                                    <option value="past">memory</option>
                                    <option value="milestone">milestone</option>
                                    <option value="future">dream</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-3 flex gap-3">
                            <div className="flex-1">
                                <label className="block text-sm text-[#8a6f53]">Title</label>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="what happened…" className={inputCls} />
                            </div>
                            <div className="w-20">
                                <label className="block text-sm text-[#8a6f53]">Emoji</label>
                                <input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="💛" className={`${inputCls} text-center`} />
                            </div>
                        </div>

                        <label className="mt-3 block text-sm text-[#8a6f53]">Subtitle</label>
                        <input value={d.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} placeholder="a one-line feeling…" className={inputCls} />

                        <label className="mt-3 block text-sm text-[#8a6f53]">Note</label>
                        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="tell the story…" className={`${inputCls} resize-none`} />

                        {/* media */}
                        <label className="mt-3 block text-sm text-[#8a6f53]">Photos, videos, audio & links</label>
                        {media.length > 0 && (
                            <ul className="mt-1 space-y-1">
                                {media.map((m, i) => (
                                    <li key={i} className="flex items-center justify-between rounded-lg border border-[#eadcc0] bg-[#f6ecd8] px-2 py-1 text-sm">
                                        <span className="truncate text-[#7a5a38]">{mediaIcon(m.type)} {m.url}</span>
                                        <button type="button" onClick={() => setMedia((list) => list.filter((_, j) => j !== i))} className="ml-2 text-[#b23b53]">✕</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                            <button type="button" onClick={() => fileInput.current?.click()} disabled={busy} className="rounded-full border border-[#e0cba2] px-3 py-1.5 text-sm text-[#8a6f53] hover:bg-[#f6ead2] disabled:opacity-50">⬆ upload</button>
                            <input ref={fileInput} type="file" accept="image/*,video/*,audio/*" multiple hidden onChange={(e) => { uploadFiles(e.target.files); e.target.value = ""; }} />
                            <div className="flex flex-1 gap-2">
                                <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLink())} placeholder="paste a YouTube/Drive/Spotify link…" className="min-w-0 flex-1 rounded-full border border-[#e0cba2] bg-white px-3 py-1.5 text-sm outline-none" />
                                <button type="button" onClick={addLink} className="rounded-full border border-[#e0cba2] px-3 py-1.5 text-sm text-[#8a6f53] hover:bg-[#f6ead2]">add</button>
                            </div>
                        </div>

                        {/* more details */}
                        <button
                            type="button"
                            onClick={() => setMore((v) => !v)}
                            className="mt-4 w-full rounded-lg border border-dashed border-[#cdb084] bg-[#fdf3df] py-2 text-sm text-[#8a6f53] hover:bg-[#f6ead2]"
                        >
                            {more ? "▾ hide extra details" : "✨ add more details (memories, songs, mood…)"}
                        </button>

                        {more && (
                            <div className="mt-3 space-y-3 rounded-xl border border-[#eadcc0] bg-[#fdf7ea] p-3">
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="block text-sm text-[#8a6f53]">Location</label>
                                        <input value={d.location ?? ""} onChange={(e) => set("location", e.target.value)} placeholder="Navsari…" className={inputCls} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm text-[#8a6f53]">Weather</label>
                                        <input value={d.weather ?? ""} onChange={(e) => set("weather", e.target.value)} placeholder="🌧 rainy, 24°" className={inputCls} />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="block text-sm text-[#8a6f53]">Mood</label>
                                        <input value={d.mood ?? ""} onChange={(e) => set("mood", e.target.value)} placeholder="giddy 🦋" className={inputCls} />
                                    </div>
                                    <div className="w-28">
                                        <label className="block text-sm text-[#8a6f53]">Importance</label>
                                        <select value={importance} onChange={(e) => setImportance(Number(e.target.value))} className={inputCls}>
                                            <option value={0}>—</option>
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <option key={n} value={n}>{"★".repeat(n)}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="block text-sm text-[#8a6f53]">Relationship stage</label>
                                        <input
                                            value={d.relationshipStage ?? ""}
                                            onChange={(e) => set("relationshipStage", e.target.value)}
                                            list="stage-options"
                                            placeholder="Strangers, Friends, Couple…"
                                            className={inputCls}
                                        />
                                        <datalist id="stage-options">
                                            {STAGES.map((s) => (
                                                <option key={s} value={s} />
                                            ))}
                                        </datalist>
                                    </div>
                                    <div className="w-28">
                                        <label className="block text-sm text-[#8a6f53]">Order</label>
                                        <input
                                            type="number"
                                            value={d.timelineOrder ?? ""}
                                            onChange={(e) => set("timelineOrder", e.target.value)}
                                            placeholder="↕ same day"
                                            className={inputCls}
                                        />
                                    </div>
                                </div>

                                {/* travel */}
                                <div className="rounded-lg border border-[#eadcc0] bg-white/60 p-2">
                                    <p className="mb-1 text-sm text-[#8a6f53]">🚆 Travel</p>
                                    <div className="flex gap-2">
                                        <input value={d.travelFrom ?? ""} onChange={(e) => set("travelFrom", e.target.value)} placeholder="from" className={inputCls} />
                                        <input value={d.travelTo ?? ""} onChange={(e) => set("travelTo", e.target.value)} placeholder="to" className={inputCls} />
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <select value={d.travelMode ?? ""} onChange={(e) => set("travelMode", e.target.value)} className={inputCls}>
                                            <option value="">mode…</option>
                                            {MODES.map((m) => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                        <input value={d.travelDuration ?? ""} onChange={(e) => set("travelDuration", e.target.value)} placeholder="duration (2h 30m)" className={inputCls} />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="block text-sm text-[#8a6f53]">Samar felt (words, comma)</label>
                                        <input value={d.feelingsSamar ?? ""} onChange={(e) => set("feelingsSamar", e.target.value)} placeholder="nervous, giddy…" className={inputCls} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm text-[#8a6f53]">Krushi felt (words, comma)</label>
                                        <input value={d.feelingsKrushi ?? ""} onChange={(e) => set("feelingsKrushi", e.target.value)} placeholder="shy, happy…" className={inputCls} />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="block text-sm text-[#8a6f53]">Firsts (comma)</label>
                                        <input value={d.firsts ?? ""} onChange={(e) => set("firsts", e.target.value)} placeholder="first call, first trip…" className={inputCls} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm text-[#8a6f53]">Gifts (comma)</label>
                                        <input value={d.gifts ?? ""} onChange={(e) => set("gifts", e.target.value)} placeholder="pendant, letter…" className={inputCls} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-[#8a6f53]">What Samar felt ❤️</label>
                                    <textarea value={d.hisMemory ?? ""} onChange={(e) => set("hisMemory", e.target.value)} rows={2} className={`${inputCls} resize-none`} />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#8a6f53]">What Krushi felt ❤️</label>
                                    <textarea value={d.herMemory ?? ""} onChange={(e) => set("herMemory", e.target.value)} rows={2} className={`${inputCls} resize-none`} />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#8a6f53]">Funny moment 😄</label>
                                    <textarea value={d.funnyMoment ?? ""} onChange={(e) => set("funnyMoment", e.target.value)} rows={2} className={`${inputCls} resize-none`} />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#8a6f53]">Favourite quote of the day 💭</label>
                                    <input value={d.favoriteQuote ?? ""} onChange={(e) => set("favoriteQuote", e.target.value)} className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#8a6f53]">People present (comma separated)</label>
                                    <input value={d.peoplePresent ?? ""} onChange={(e) => set("peoplePresent", e.target.value)} placeholder="Aastha, mummy…" className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#8a6f53]">Tags (comma separated)</label>
                                    <input value={d.tags ?? ""} onChange={(e) => set("tags", e.target.value)} placeholder="first, rainy, trip…" className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#8a6f53]">Songs (one per line — Title | link)</label>
                                    <textarea value={d.songs ?? ""} onChange={(e) => set("songs", e.target.value)} rows={2} placeholder={"Tum Se Hi | https://open.spotify.com/…"} className={`${inputCls} resize-none`} />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#8a6f53]">Map link (Google Maps)</label>
                                    <input value={d.map ?? ""} onChange={(e) => set("map", e.target.value)} placeholder="https://maps.app.goo.gl/…" className={inputCls} />
                                </div>
                            </div>
                        )}

                        <div className="mt-5 flex gap-3">
                            <button type="button" onClick={onCancel} className="flex-1 rounded-full border border-[#e0cba2] py-2 text-[#8a6f53] hover:bg-[#f6ead2]">Cancel</button>
                            <button type="button" onClick={save} disabled={busy || !date || !title.trim()} className="flex-1 rounded-full bg-[#b23b53] py-2 font-medium text-white transition hover:scale-[1.02] disabled:opacity-50">
                                {busy ? "Saving…" : mode === "edit" ? "Save ✓" : "Add 💛"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
