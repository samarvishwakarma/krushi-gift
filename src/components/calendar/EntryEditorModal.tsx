"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEditMode } from "@/components/edit/EditModeProvider";
import type { MediaItem, TimelineEntry, TimelineKind } from "@/data/timeline";

export type EntryDraft = {
    date: string;
    title: string;
    note: string;
    kind: TimelineKind;
    emoji: string;
    media: MediaItem[];
};

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
    const fileInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!open) return;
        setDate(initial?.date ?? "");
        setTitle(initial?.title ?? "");
        setNote(initial?.note ?? "");
        setKind(initial?.kind ?? "past");
        setEmoji(initial?.emoji ?? "");
        setMedia(initial?.media ?? []);
        setLinkUrl("");
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
                const d = await res.json().catch(() => null);
                if (res.ok && d?.url) {
                    setMedia((m) => [
                        ...m,
                        { type: file.type.startsWith("video") ? "video" : "photo", url: d.url },
                    ]);
                } else {
                    alert(d?.error || "Upload failed");
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
        await onSave({ date, title: title.trim(), note: note.trim(), kind, emoji: emoji.trim(), media });
        setBusy(false);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-110 flex items-center justify-center overflow-y-auto bg-[#3a2417]/50 p-4 backdrop-blur-sm"
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
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-[#e0cba2] bg-white px-3 py-2 outline-none"
                                />
                            </div>
                            <div className="w-32">
                                <label className="block text-sm text-[#8a6f53]">Type</label>
                                <select
                                    value={kind}
                                    onChange={(e) => setKind(e.target.value as TimelineKind)}
                                    className="mt-1 w-full rounded-lg border border-[#e0cba2] bg-white px-3 py-2 outline-none"
                                >
                                    <option value="past">memory</option>
                                    <option value="milestone">milestone</option>
                                    <option value="future">dream</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-3 flex gap-3">
                            <div className="flex-1">
                                <label className="block text-sm text-[#8a6f53]">Title</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="what happened…"
                                    className="mt-1 w-full rounded-lg border border-[#e0cba2] bg-white px-3 py-2 outline-none"
                                />
                            </div>
                            <div className="w-20">
                                <label className="block text-sm text-[#8a6f53]">Emoji</label>
                                <input
                                    value={emoji}
                                    onChange={(e) => setEmoji(e.target.value)}
                                    placeholder="💛"
                                    className="mt-1 w-full rounded-lg border border-[#e0cba2] bg-white px-3 py-2 text-center outline-none"
                                />
                            </div>
                        </div>

                        <label className="mt-3 block text-sm text-[#8a6f53]">Note</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            placeholder="tell the story…"
                            className="mt-1 w-full resize-none rounded-lg border border-[#e0cba2] bg-white px-3 py-2 outline-none"
                        />

                        {/* media */}
                        <label className="mt-3 block text-sm text-[#8a6f53]">
                            Photos, videos & links
                        </label>
                        {media.length > 0 && (
                            <ul className="mt-1 space-y-1">
                                {media.map((m, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center justify-between rounded-lg border border-[#eadcc0] bg-[#f6ecd8] px-2 py-1 text-sm"
                                    >
                                        <span className="truncate text-[#7a5a38]">
                                            {m.type === "photo" ? "📷" : m.type === "video" ? "🎬" : "🔗"}{" "}
                                            {m.url}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setMedia((list) => list.filter((_, j) => j !== i))}
                                            className="ml-2 text-[#b23b53]"
                                        >
                                            ✕
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => fileInput.current?.click()}
                                disabled={busy}
                                className="rounded-full border border-[#e0cba2] px-3 py-1.5 text-sm text-[#8a6f53] hover:bg-[#f6ead2] disabled:opacity-50"
                            >
                                ⬆ upload
                            </button>
                            <input
                                ref={fileInput}
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                hidden
                                onChange={(e) => {
                                    uploadFiles(e.target.files);
                                    e.target.value = "";
                                }}
                            />
                            <div className="flex flex-1 gap-2">
                                <input
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLink())}
                                    placeholder="paste a YouTube/Drive/link…"
                                    className="min-w-0 flex-1 rounded-full border border-[#e0cba2] bg-white px-3 py-1.5 text-sm outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={addLink}
                                    className="rounded-full border border-[#e0cba2] px-3 py-1.5 text-sm text-[#8a6f53] hover:bg-[#f6ead2]"
                                >
                                    add
                                </button>
                            </div>
                        </div>

                        <div className="mt-5 flex gap-3">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 rounded-full border border-[#e0cba2] py-2 text-[#8a6f53] hover:bg-[#f6ead2]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={save}
                                disabled={busy || !date || !title.trim()}
                                className="flex-1 rounded-full bg-[#b23b53] py-2 font-medium text-white transition hover:scale-[1.02] disabled:opacity-50"
                            >
                                {busy ? "Saving…" : mode === "edit" ? "Save ✓" : "Add 💛"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
