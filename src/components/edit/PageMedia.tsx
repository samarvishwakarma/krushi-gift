"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useEditMode } from "./EditModeProvider";
import Polaroid from "@/components/scrapbook/Polaroid";
import VoiceNote from "@/components/scrapbook/VoiceNote";

type DbMedia = {
    id: string;
    type: "photo" | "audio";
    url: string;
    caption: string | null;
};

type SeedPhoto = { src?: string; caption?: string; emoji?: string };

type Props = {
    pageId: string;
    seedPhotos?: SeedPhoto[];
    seedAudio: string;
    accent?: string;
    sticker?: string;
};

export default function PageMedia({
    pageId,
    seedPhotos = [],
    seedAudio,
    accent = "#b23b53",
    sticker = "💌",
}: Props) {
    const { editing, editFetch } = useEditMode();
    const [photos, setPhotos] = useState<DbMedia[]>([]);
    const [audio, setAudio] = useState<DbMedia | null>(null);
    const [busy, setBusy] = useState(false);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const fileInput = useRef<HTMLInputElement>(null);

    // Drag-to-reorder Krushi's photos; persist the new order to `sort`.
    const dropAt = useCallback(
        (to: number) => {
            setDragIndex((from) => {
                if (from === null || from === to) return null;
                setPhotos((prev) => {
                    const next = [...prev];
                    const [moved] = next.splice(from, 1);
                    next.splice(to, 0, moved);
                    next.forEach((m, idx) =>
                        editFetch(`/api/media/${m.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ sort: idx }),
                        }).catch(() => {}),
                    );
                    return next;
                });
                return null;
            });
        },
        [editFetch],
    );

    useEffect(() => {
        fetch(`/api/media?page=${encodeURIComponent(pageId)}`)
            .then((r) => r.json())
            .then((d) => {
                const list: DbMedia[] = Array.isArray(d?.media) ? d.media : [];
                setPhotos(list.filter((m) => m.type === "photo"));
                setAudio(list.find((m) => m.type === "audio") ?? null);
            })
            .catch(() => {});
    }, [pageId]);

    const upload = useCallback(
        async (file: File, folder: string) => {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("folder", folder);
            const res = await editFetch("/api/upload", { method: "POST", body: fd });
            const d = await res.json().catch(() => null);
            if (!res.ok || !d?.url) throw new Error(d?.error || "Upload failed");
            return d.url as string;
        },
        [editFetch],
    );

    const addRecord = useCallback(
        async (type: "photo" | "audio", url: string) => {
            const res = await editFetch("/api/media", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ page: pageId, type, url }),
            });
            const d = await res.json().catch(() => null);
            if (!res.ok || !d?.media) throw new Error(d?.error || "Save failed");
            return d.media as DbMedia;
        },
        [editFetch, pageId],
    );

    const onAddPhotos = useCallback(
        async (files: FileList | null) => {
            if (!files?.length) return;
            setBusy(true);
            try {
                for (const file of Array.from(files)) {
                    const url = await upload(file, `pages/${pageId}/photos`);
                    const rec = await addRecord("photo", url);
                    setPhotos((p) => [...p, rec]);
                }
            } catch (e) {
                alert(e instanceof Error ? e.message : "Could not add photo.");
            } finally {
                setBusy(false);
            }
        },
        [upload, addRecord, pageId],
    );

    const onAddAudio = useCallback(
        async (file: File) => {
            setBusy(true);
            try {
                if (audio) {
                    await editFetch(`/api/media/${audio.id}`, { method: "DELETE" });
                    setAudio(null);
                }
                const url = await upload(file, `pages/${pageId}/audio`);
                const rec = await addRecord("audio", url);
                setAudio(rec);
            } catch (e) {
                alert(e instanceof Error ? e.message : "Could not add audio.");
            } finally {
                setBusy(false);
            }
        },
        [audio, editFetch, upload, addRecord, pageId],
    );

    const removeMedia = useCallback(
        async (m: DbMedia) => {
            const res = await editFetch(`/api/media/${m.id}`, { method: "DELETE" });
            if (!res.ok) return;
            if (m.type === "audio") setAudio(null);
            else setPhotos((p) => p.filter((x) => x.id !== m.id));
        },
        [editFetch],
    );

    const hasPhotos = seedPhotos.length > 0 || photos.length > 0;

    return (
        <>
            {/* photos */}
            {(hasPhotos || editing) && (
                <div className="mt-9 flex flex-wrap items-start justify-center gap-5">
                    {seedPhotos.map((p, i) => (
                        <motion.div
                            key={`seed-${i}`}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="w-40"
                        >
                            <Polaroid
                                src={p.src}
                                caption={p.caption}
                                emoji={p.emoji ?? sticker}
                                rotate={i % 2 === 0 ? -3 : 3}
                            />
                        </motion.div>
                    ))}

                    {photos.map((m, i) => (
                        <div
                            key={m.id}
                            className={`relative w-40 ${editing ? "cursor-grab active:cursor-grabbing" : ""} ${
                                dragIndex === i ? "opacity-50" : ""
                            }`}
                            draggable={editing}
                            onDragStart={() => setDragIndex(i)}
                            onDragOver={(e) => editing && e.preventDefault()}
                            onDrop={() => dropAt(i)}
                            onDragEnd={() => setDragIndex(null)}
                        >
                            <Polaroid src={m.url} caption={m.caption ?? ""} rotate={i % 2 === 0 ? 2 : -2} />
                            {editing && (
                                <button
                                    type="button"
                                    onClick={() => removeMedia(m)}
                                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-[#e7b3bd] bg-white text-[#b23b53] shadow"
                                    aria-label="Remove photo"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}

                    {editing && (
                        <button
                            type="button"
                            onClick={() => fileInput.current?.click()}
                            disabled={busy}
                            className="flex h-40 w-40 flex-col items-center justify-center rounded-[4px] border-2 border-dashed border-[#cdb084] bg-[#fffaf0] text-[#8a6f53] transition hover:bg-[#f6ead2] disabled:opacity-50"
                        >
                            <span className="text-3xl">＋</span>
                            <span className="mt-1 text-sm">{busy ? "uploading…" : "add photos"}</span>
                        </button>
                    )}
                    <input
                        ref={fileInput}
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={(e) => {
                            onAddPhotos(e.target.files);
                            e.target.value = "";
                        }}
                    />
                </div>
            )}

            {/* Samar's fixed voice note */}
            <div className="mt-10 w-full">
                <VoiceNote src={seedAudio} accent={accent} />
            </div>

            {/* Krushi's voice note (editable) */}
            {audio && (
                <div className="relative mt-4 w-full">
                    <VoiceNote src={audio.url} accent="#7a9b6b" label="a voice from Krushi 💗" />
                    {editing && (
                        <button
                            type="button"
                            onClick={() => removeMedia(audio)}
                            className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#e7b3bd] bg-white text-[#b23b53] shadow"
                            aria-label="Remove voice note"
                        >
                            ✕
                        </button>
                    )}
                </div>
            )}

            {editing && (
                <div className="mt-4 w-full max-w-md mx-auto">
                    <AudioAdder
                        busy={busy}
                        hasAudio={Boolean(audio)}
                        onFile={onAddAudio}
                    />
                </div>
            )}
        </>
    );
}

/* ---- Add a voice note: upload a file OR record from the mic ---- */
function AudioAdder({
    busy,
    hasAudio,
    onFile,
}: {
    busy: boolean;
    hasAudio: boolean;
    onFile: (file: File) => void;
}) {
    const audioInput = useRef<HTMLInputElement>(null);
    const [recording, setRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    const startRecording = async () => {
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const rec = new MediaRecorder(stream);
            chunksRef.current = [];
            rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
            rec.onstop = () => {
                stream.getTracks().forEach((t) => t.stop());
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                onFile(new File([blob], `voice-${Date.now()}.webm`, { type: "audio/webm" }));
            };
            rec.start();
            recorderRef.current = rec;
            setRecording(true);
        } catch {
            setError("Mic access was blocked.");
        }
    };

    const stopRecording = () => {
        recorderRef.current?.stop();
        recorderRef.current = null;
        setRecording(false);
    };

    return (
        <div className="rounded-2xl border border-dashed border-[#cdb084] bg-[#fffaf0] p-4 text-center">
            <p className="[font-family:var(--font-caveat)] text-xl text-[#8a6f53]">
                {hasAudio ? "replace the voice note" : "add a voice note"}
            </p>
            <div className="mt-3 flex justify-center gap-3">
                <button
                    type="button"
                    onClick={() => audioInput.current?.click()}
                    disabled={busy || recording}
                    className="rounded-full border border-[#e0cba2] px-4 py-2 text-[#8a6f53] transition hover:bg-[#f6ead2] disabled:opacity-50"
                >
                    ⬆ upload
                </button>
                {!recording ? (
                    <button
                        type="button"
                        onClick={startRecording}
                        disabled={busy}
                        className="rounded-full bg-[#b23b53] px-4 py-2 text-white transition hover:scale-[1.02] disabled:opacity-50"
                    >
                        ● record
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={stopRecording}
                        className="animate-pulse rounded-full bg-[#7a9b6b] px-4 py-2 text-white"
                    >
                        ■ stop &amp; save
                    </button>
                )}
            </div>
            {busy && <p className="mt-2 text-sm text-[#a98a63]">uploading…</p>}
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            <input
                ref={audioInput}
                type="file"
                accept="audio/*"
                hidden
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFile(f);
                    e.target.value = "";
                }}
            />
        </div>
    );
}
