"use client";

import { Fragment, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { TimelineEntry } from "@/data/timeline";
import EntryCard from "./EntryCard";
import { parseDate } from "./helpers";

export default function TimelineView({
    entries,
    reactions,
    editing,
    onHeart,
    onEdit,
    onDelete,
    onAdd,
}: {
    entries: TimelineEntry[];
    reactions: Record<string, { hearted: boolean }>;
    editing: boolean;
    onHeart: (id: string, next: boolean) => void;
    onEdit: (entry: TimelineEntry) => void;
    onDelete: (id: string) => void;
    onAdd: () => void;
}) {
    const [open, setOpen] = useState<TimelineEntry | null>(null);
    let lastYear = 0;
    let lastMonth = -1;

    return (
        <div className="relative mx-auto max-w-3xl">
            {/* the spine */}
            <div className="absolute bottom-0 left-4 top-0 w-px bg-linear-to-b from-[#e3cfa6] via-[#d9b48a] to-transparent sm:left-1/2" />

            <div className="space-y-8">
                {entries.map((entry, i) => {
                    const d = parseDate(entry.date);
                    const year = d.getFullYear();
                    const month = d.getMonth();
                    const newYear = year !== lastYear;
                    const newMonth = newYear || month !== lastMonth;
                    lastYear = year;
                    lastMonth = month;
                    const left = i % 2 === 0;

                    return (
                        <Fragment key={entry.id}>
                            {newYear && (
                                <div className="relative pl-12 sm:pl-0 sm:text-center">
                                    <h2 className="[font-family:var(--font-caveat)] text-5xl text-[#8a6f53]">
                                        {year}
                                    </h2>
                                </div>
                            )}
                            {newMonth && (
                                <div className="relative pl-12 sm:pl-0 sm:text-center">
                                    <h3 className="[font-family:var(--font-caveat)] text-2xl text-[#b98e5a]">
                                        {d.toLocaleDateString("en-GB", { month: "long" })}
                                    </h3>
                                </div>
                            )}

                            <div className="relative">
                                {/* star marker on the spine */}
                                <span className="absolute left-[9px] top-6 z-10 text-lg sm:left-1/2 sm:-translate-x-1/2">
                                    {entry.emoji
                                        ? entry.emoji
                                        : entry.kind === "milestone"
                                            ? "✦"
                                            : entry.kind === "future"
                                                ? "🌙"
                                                : "✧"}
                                </span>
                                <div
                                    className={`pl-12 sm:w-1/2 sm:pl-0 ${left ? "sm:pr-10" : "sm:ml-auto sm:pl-10"
                                        }`}
                                >
                                    <EntryCard
                                        entry={entry}
                                        hearted={Boolean(reactions[entry.id]?.hearted)}
                                        editing={editing}
                                        onHeart={onHeart}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        compact
                                        onOpen={() => setOpen(entry)}
                                    />
                                </div>
                            </div>
                        </Fragment>
                    );
                })}

                {/* the story continues */}
                <div className="relative pl-12 pt-2 sm:pl-0 sm:text-center">
                    <span className="absolute left-[7px] top-3 text-lg sm:left-1/2 sm:-translate-x-1/2">
                        ✏️
                    </span>
                    <p className="[font-family:var(--font-caveat)] text-2xl text-[#a98a63]">
                        the story continues…
                    </p>
                    {editing && (
                        <button
                            type="button"
                            onClick={onAdd}
                            className="mt-2 rounded-full bg-[#b23b53] px-5 py-2 text-white transition hover:scale-105"
                        >
                            + add a day
                        </button>
                    )}
                </div>
            </div>

            {/* detail popup with full note + large media */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto bg-[#3a2417]/50 p-4 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.94, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="my-10 w-full max-w-lg"
                        >
                            <div className="mb-3 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setOpen(null)}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fffaf0] text-[#b23b53] shadow"
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                            </div>
                            <EntryCard
                                entry={open}
                                hearted={Boolean(reactions[open.id]?.hearted)}
                                editing={editing}
                                onHeart={onHeart}
                                onEdit={(e) => {
                                    setOpen(null);
                                    onEdit(e);
                                }}
                                onDelete={(id) => {
                                    setOpen(null);
                                    onDelete(id);
                                }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
