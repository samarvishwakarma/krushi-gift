"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ORIGIN_DATE, type TimelineEntry } from "@/data/timeline";
import EntryCard from "./EntryCard";
import { fmtLong, isSameDay, parseDate } from "./helpers";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const pad = (n: number) => String(n).padStart(2, "0");
const CELLS = 42; // always 6 rows → no layout shift between months

export default function CalendarGridView({
    entries,
    reactions,
    editing,
    onHeart,
    onEdit,
    onDelete,
    onAddDate,
}: {
    entries: TimelineEntry[];
    reactions: Record<string, { hearted: boolean }>;
    editing: boolean;
    onHeart: (id: string, next: boolean) => void;
    onEdit: (entry: TimelineEntry) => void;
    onDelete: (id: string) => void;
    onAddDate: (dateStr: string) => void;
}) {
    const origin = parseDate(ORIGIN_DATE);
    const [view, setView] = useState(() => new Date(origin.getFullYear(), origin.getMonth(), 1));
    const [selected, setSelected] = useState<string | null>(null);

    const byDate = useMemo(() => {
        const m: Record<string, TimelineEntry[]> = {};
        for (const e of entries) (m[e.date] ??= []).push(e);
        return m;
    }, [entries]);

    const year = view.getFullYear();
    const month = view.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthLabel = view.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

    const cells = Array.from({ length: CELLS }, (_, i) => {
        const day = i - firstDay + 1;
        return day >= 1 && day <= daysInMonth ? day : null;
    });

    const shift = (delta: number) => {
        setView(new Date(year, month + delta, 1));
        setSelected(null);
    };

    const selectedEntries = selected ? byDate[selected] ?? [] : [];

    return (
        <div className="mx-auto max-w-xl">
            <div className="rounded-[20px] border border-[#e3cfa6] bg-[#fffaf0] p-4 shadow-[0_16px_44px_rgba(120,80,40,0.16)]">
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => shift(-1)}
                        className="rounded-full px-3 py-1 text-xl text-[#8a6f53] hover:bg-[#f6ead2]"
                        aria-label="Previous month"
                    >
                        ‹
                    </button>
                    <h2 className="[font-family:var(--font-caveat)] text-3xl text-[#b23b53]">
                        {monthLabel}
                    </h2>
                    <button
                        type="button"
                        onClick={() => shift(1)}
                        className="rounded-full px-3 py-1 text-xl text-[#8a6f53] hover:bg-[#f6ead2]"
                        aria-label="Next month"
                    >
                        ›
                    </button>
                </div>

                <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-[#a98a63]">
                    {WEEKDAYS.map((d, i) => (
                        <div key={i}>{d}</div>
                    ))}
                </div>

                <div className="mt-1 grid grid-cols-7 gap-1.5">
                    {cells.map((day, i) => {
                        if (day === null) return <div key={i} className="aspect-square" />;

                        const dateObj = new Date(year, month, day);
                        const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
                        const preOrigin = dateObj.getTime() < origin.getTime();
                        const dayEntries = byDate[dateStr] ?? [];
                        const has = dayEntries.length > 0;
                        const isSel = selected === dateStr;
                        const isToday = isSameDay(dateObj, new Date());
                        const emoji = dayEntries[0]?.emoji;

                        return (
                            <button
                                key={i}
                                type="button"
                                disabled={preOrigin && !has}
                                onClick={() => {
                                    if (has) setSelected(dateStr);
                                    else if (editing) onAddDate(dateStr);
                                }}
                                className={`group relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition ${has
                                        ? "bg-linear-to-br from-[#fbe7d2] to-[#f5d3b4] text-[#5b4632] shadow-[0_2px_8px_rgba(178,59,83,0.18)] hover:scale-[1.05]"
                                        : preOrigin
                                            ? "border border-[#e7dcc6] bg-[#efe7d7]/60 text-[#c4b8a1]"
                                            : "text-[#8a6f53] hover:bg-[#f6ead2]"
                                    } ${isSel ? "ring-2 ring-[#b23b53]" : ""} ${isToday && !has ? "ring-1 ring-[#b23b53]/50" : ""
                                    }`}
                                title={preOrigin ? "before you — a quiet, colourless day" : dateStr}
                            >
                                {has ? (
                                    <>
                                        <span className="text-xl leading-none">{emoji || "💗"}</span>
                                        <span className="absolute left-1.5 top-1 text-[10px] font-semibold opacity-70">
                                            {day}
                                        </span>
                                        {dayEntries.length > 1 && (
                                            <span className="absolute bottom-1 text-[9px] text-[#b23b53]">
                                                +{dayEntries.length - 1} more
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <span className={preOrigin ? "opacity-60" : ""}>{day}</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <p className="mt-3 text-center text-xs text-[#a98a63]">
                    the faded days are the ones before you · tap a glowing day to open it
                    {editing ? " · tap an empty day to add" : ""}
                </p>
            </div>

            {/* selected day → popup (no scrolling needed) */}
            <AnimatePresence>
                {selectedEntries.length > 0 && (
                    <motion.div
                        className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto bg-[#3a2417]/50 p-4 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelected(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.94, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="my-10 w-full max-w-md"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="[font-family:var(--font-caveat)] text-3xl text-white drop-shadow">
                                    {selected && fmtLong(selected)}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setSelected(null)}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fffaf0] text-[#b23b53] shadow"
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="space-y-4">
                                {selectedEntries.map((entry) => (
                                    <EntryCard
                                        key={entry.id}
                                        entry={entry}
                                        hearted={Boolean(reactions[entry.id]?.hearted)}
                                        editing={editing}
                                        onHeart={onHeart}
                                        onEdit={(e) => {
                                            setSelected(null);
                                            onEdit(e);
                                        }}
                                        onDelete={(id) => {
                                            onDelete(id);
                                            setSelected(null);
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
