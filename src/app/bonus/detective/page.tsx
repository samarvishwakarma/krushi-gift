"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import BackHomeButton from "@/components/BackHomeButton";
import CornerPeekSprite from "@/components/scrapbook/CornerPeekSprite";

const FLOATERS = ["🔍", "❓", "🕵️", "🔎", "📎", "🗂️"];

export default function DetectivePage() {
    const reduce = useReducedMotion();
    const [notified, setNotified] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setNotified(true), 1600);
        return () => clearTimeout(t);
    }, []);

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
            <BackHomeButton />

            {/* sweeping spotlight */}
            {!reduce && (
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -top-1/3 h-[160%] w-72 bg-[radial-gradient(closest-side,rgba(255,240,200,0.55),transparent)] blur-2xl"
                    animate={{ left: ["-20%", "90%", "-20%"] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                />
            )}

            {/* drifting clue emojis */}
            {FLOATERS.map((c, i) => (
                <motion.span
                    key={i}
                    aria-hidden
                    className="pointer-events-none absolute select-none text-2xl opacity-40"
                    style={{ left: `${(i * 61) % 90 + 4}%`, top: `${(i * 37) % 80 + 8}%` }}
                    animate={reduce ? undefined : { y: [0, -18, 0], rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                >
                    {c}
                </motion.span>
            ))}

            {/* the case file card + peeking detective */}
            <div className="relative w-full max-w-lg">
                {/* Ghibli mascot peeking from the card corners — 384×512 frames, 4×2 grid */}
                <CornerPeekSprite
                    src="/sprites/detective.png"
                    frameWidth={1536 / 4}
                    frameHeight={1024 / 2}
                    frames={8}
                    columns={4}
                    fps={4}
                    scale={0.3}
                />
                <motion.div
                    initial={{ opacity: 0, y: 30, rotate: -1.5 }}
                    animate={{ opacity: 1, y: 0, rotate: -1 }}
                    transition={{ type: "spring", stiffness: 90, damping: 14 }}
                    className="relative z-10 w-full overflow-hidden rounded-[20px] border border-[#d9c19a] bg-[#fffaf0] p-8 text-center shadow-[0_24px_60px_rgba(80,50,20,0.28)]"
                >
                    <div className="relative">
                        {/* REC badge */}
                        <div className="mb-4 flex items-center justify-center gap-2">
                            <motion.span
                                className="h-2.5 w-2.5 rounded-full bg-red-500"
                                animate={reduce ? undefined : { opacity: [1, 0.2, 1] }}
                                transition={{ duration: 1.2, repeat: Infinity }}
                            />
                            <span className="text-xs uppercase tracking-[0.3em] text-[#a05a3a]">
                                REC · under surveillance
                            </span>
                        </div>

                        <motion.div
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: -8 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 180 }}
                            className="mx-auto mb-3 inline-block rounded-lg border-2 border-dashed border-[#b23b53] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#b23b53]"
                        >
                            Case File #KM-001
                        </motion.div>

                        <div className="text-6xl">🕵️‍♀️🔍</div>

                        <h1 className="mt-3 [font-family:var(--font-caveat)] text-4xl leading-tight text-[#b23b53] sm:text-5xl">
                            Congratulations,
                            <br />
                            Detective Krushi Sherlock Holmes
                        </h1>

                        {[
                            "Your curiosity level has reached dangerous levels.",
                        ].map((line, i) => (
                            <motion.p
                                key={i}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + i * 0.3 }}
                                className="mt-4 text-lg text-[#7a5a38]"
                            >
                                {line}
                            </motion.p>
                        ))}

                        {/* notification toast */}
                        <motion.div
                            initial={{ opacity: 0, y: -12, scale: 0.9 }}
                            animate={notified ? { opacity: 1, y: 0, scale: 1 } : {}}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="mx-auto mt-6 flex max-w-sm items-center gap-3 rounded-2xl border border-[#e7d4b0] bg-white px-4 py-3 text-left shadow-lg"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b23b53] text-lg text-white">
                                S
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[#5b4632]">Samar</p>
                                <p className="text-sm text-[#8a6f53]">
                                    has been notified. 👀 I saw that.
                                </p>
                            </div>
                            {!reduce && (
                                <motion.span
                                    className="ml-auto text-lg"
                                    animate={{ rotate: [0, 20, -20, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 2 }}
                                >
                                    🔔
                                </motion.span>
                            )}
                        </motion.div>

                        <p className="mt-6 [font-family:var(--font-caveat)] text-2xl text-[#a98a63]">
                            keep snooping, detective… I love that about you 💗
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
