"use client";

import { motion, useReducedMotion } from "framer-motion";
import BackHomeButton from "@/components/BackHomeButton";
import CornerPeekSprite from "@/components/scrapbook/CornerPeekSprite";

const SHHS = ["🤫", "👀", "🚫", "🙊", "💭"];

export default function OopsPage() {
    const reduce = useReducedMotion();

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
            <BackHomeButton />

            {/* soft dim vignette so it feels like a hidden room */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(60,36,23,0.18))]" />

            {/* floating shh / eyes */}
            {SHHS.map((c, i) => (
                <motion.span
                    key={i}
                    aria-hidden
                    className="pointer-events-none absolute select-none text-2xl opacity-40"
                    style={{ left: `${(i * 53) % 88 + 5}%`, top: `${(i * 71) % 78 + 8}%` }}
                    animate={reduce ? undefined : { y: [0, -16, 0], opacity: [0.2, 0.55, 0.2] }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                >
                    {c}
                </motion.span>
            ))}

            {/* peeking eyes above the card */}
            {!reduce && (
                <motion.div
                    aria-hidden
                    className="absolute z-10 -mt-104 text-5xl"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: [30, 0, 0, 30], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 1.5, times: [0, 0.2, 0.8, 1] }}
                >
                    👀
                </motion.div>
            )}

            {/* the forbidden card + peeking mascot */}
            <div className="relative w-full max-w-md">
                {/* Ghibli mascot peeking from the card corners — set frames/grid to your sheet */}
                <CornerPeekSprite
                    src="/sprites/oops.png"
                    frameWidth={1536 / 4}
                    frameHeight={1024 / 2}
                    frames={8}
                    columns={4}
                    fps={4}
                    scale={0.35}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: 1.5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 1 }}
                    transition={{ type: "spring", stiffness: 90, damping: 13 }}
                    className="relative z-10 w-full overflow-hidden rounded-[20px] border border-[#d9c19a] bg-[#fffaf0] p-8 text-center shadow-[0_24px_60px_rgba(80,50,20,0.28)]"
                >
                    {/* diagonal RESTRICTED tape */}
                    <div className="pointer-events-none absolute -right-14 top-6 rotate-45 bg-[#b23b53] px-16 py-1 text-xs font-bold uppercase tracking-widest text-white shadow">
                        restricted
                    </div>

                    <div className="relative">
                        <motion.div
                            className="text-6xl"
                            animate={reduce ? undefined : { rotate: [0, -8, 8, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        >
                            🙈
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-4 [font-family:var(--font-caveat)] text-4xl leading-tight text-[#b23b53] sm:text-5xl"
                        >
                            You were not supposed
                            <br />
                            to find this.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="mt-4 text-lg text-[#7a5a38]"
                        >
                            Yet somehow… I&apos;m not surprised. 😏
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4 }}
                            className="mt-6 [font-family:var(--font-caveat)] text-2xl text-[#a98a63]"
                        >
                            go on then… pretend you never saw it 🤫
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
