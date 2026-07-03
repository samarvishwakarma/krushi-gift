"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
    src: string;
    label?: string;
    accent?: string;
    /** Message shown when the clip is missing or won't play. */
    lockedNote?: string;
};

/**
 * A scrapbook-styled audio player. If the clip is missing or corrupted, it
 * gracefully turns into a blurred "coming soon" teaser instead of a dead
 * player — keeping the game romantic and mysterious.
 */
export default function VoiceNote({
    src,
    label = "a voice from Samar",
    accent = "#b23b53",
    lockedNote = "Something just for you… come back soon latter💌",
}: Props) {
    const reduce = useReducedMotion();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [blocked, setBlocked] = useState(false);

    const toggle = () => {
        const a = audioRef.current;
        if (!a) return;
        if (playing) {
            a.pause();
            setPlaying(false);
            return;
        }
        const p = a.play();
        setPlaying(true);
        if (p) {
            p.catch(() => {
                setPlaying(false);
                setBlocked(true);
            });
        }
    };

    const bars = (live: boolean) => (
        <div className="mt-2 flex h-7 items-end gap-1">
            {Array.from({ length: 22 }).map((_, i) => (
                <motion.span
                    key={i}
                    className="w-1 flex-1 rounded-full bg-[#d99]/80"
                    animate={
                        live && playing && !reduce
                            ? { scaleY: [0.3, 1, 0.5, 0.9, 0.3] }
                            : { scaleY: 0.3 }
                    }
                    transition={{
                        duration: 0.9 + (i % 4) * 0.2,
                        repeat: live && playing && !reduce ? Infinity : 0,
                        ease: "easeInOut",
                        delay: i * 0.04,
                    }}
                    style={{ originY: 1, height: "100%" }}
                />
            ))}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-md rotate-[-0.5deg] overflow-hidden rounded-2xl border border-[#e3cfa6] bg-[#fffaf0] p-4 shadow-[0_12px_36px_rgba(120,80,40,0.18)]"
        >
            {/* Always mounted so we can detect missing/corrupt files. */}
            <audio
                ref={audioRef}
                src={src}
                preload="metadata"
                onError={() => setBlocked(true)}
                onEnded={() => setPlaying(false)}
            />

            {blocked ? (
                <div className="relative">
                    {/* the player, blurred out */}
                    <div className="pointer-events-none flex select-none items-center gap-4 opacity-40 blur-[3px]">
                        <div
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl text-white"
                            style={{ background: accent }}
                        >
                            ▶
                        </div>
                        <div className="flex-1">
                            <p
                                className="[font-family:var(--font-caveat)] text-2xl leading-none"
                                style={{ color: accent }}
                            >
                                {label}
                            </p>
                            {bars(false)}
                        </div>
                    </div>

                    {/* teaser overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                        <div className="text-2xl">🔒</div>
                        <p
                            className="[font-family:var(--font-caveat)] text-2xl leading-none"
                            style={{ color: accent }}
                        >
                            a surprise is on the way
                        </p>
                        <p className="mt-1 max-w-xs text-sm text-[#8a6f53]">
                            {lockedNote}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={toggle}
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl text-white shadow-md transition hover:scale-105 active:scale-95"
                        style={{ background: accent }}
                        aria-label={playing ? "Pause voice note" : "Play voice note"}
                    >
                        {playing ? "❚❚" : "▶"}
                    </button>
                    <div className="flex-1">
                        <p
                            className="[font-family:var(--font-caveat)] text-2xl leading-none"
                            style={{ color: accent }}
                        >
                            {label}
                        </p>
                        {bars(true)}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
