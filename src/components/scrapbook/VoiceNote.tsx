"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
    src: string;
    label?: string;
    accent?: string;
};

/** A scrapbook-styled audio player: a round play button + animated equaliser. */
export default function VoiceNote({
    src,
    label = "a voice from Samar",
    accent = "#b23b53",
}: Props) {
    const reduce = useReducedMotion();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);

    const toggle = () => {
        const a = audioRef.current;
        if (!a) return;
        if (playing) a.pause();
        else a.play();
        setPlaying(!playing);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-md items-center gap-4 rotate-[-0.5deg] rounded-2xl border border-[#e3cfa6] bg-[#fffaf0] p-4 shadow-[0_12px_36px_rgba(120,80,40,0.18)]"
        >
            <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} />
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
                <div className="mt-2 flex h-7 items-end gap-1">
                    {Array.from({ length: 22 }).map((_, i) => (
                        <motion.span
                            key={i}
                            className="w-1 flex-1 rounded-full bg-[#d99]/80"
                            animate={
                                playing && !reduce
                                    ? { scaleY: [0.3, 1, 0.5, 0.9, 0.3] }
                                    : { scaleY: 0.3 }
                            }
                            transition={{
                                duration: 0.9 + (i % 4) * 0.2,
                                repeat: playing && !reduce ? Infinity : 0,
                                ease: "easeInOut",
                                delay: i * 0.04,
                            }}
                            style={{ originY: 1, height: "100%" }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
