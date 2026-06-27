"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Warm aged-paper backdrop for the scrapbook pages: a cream gradient, a faint
 * SVG paper grain, a soft vignette, and a few hand-drawn doodles that drift.
 * Self-contained (no external images) so it works offline.
 */

const DOODLES = [
    { char: "♥", x: "8%", y: "18%", size: 26, rotate: -12, delay: 0 },
    { char: "✦", x: "88%", y: "12%", size: 20, rotate: 8, delay: 0.6 },
    { char: "♥", x: "92%", y: "70%", size: 22, rotate: 14, delay: 1.1 },
    { char: "✿", x: "6%", y: "76%", size: 24, rotate: -6, delay: 0.3 },
    { char: "✦", x: "15%", y: "48%", size: 16, rotate: 0, delay: 1.4 },
    { char: "♥", x: "80%", y: "40%", size: 18, rotate: -10, delay: 0.9 },
];

export default function PaperBackground() {
    const reduce = useReducedMotion();

    return (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            {/* warm paper gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(120% 120% at 50% 0%, #FCF4E3 0%, #F7E9CE 45%, #F0DDBE 100%)",
                }}
            />

            {/* paper grain */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.06]">
                <filter id="paper-grain">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.9"
                        numOctaves="2"
                        stitchTiles="stitch"
                    />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#paper-grain)" />
            </svg>

            {/* soft vignette */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(120,80,40,0.10) 100%)",
                }}
            />

            {/* drifting doodles */}
            {DOODLES.map((d, i) => (
                <motion.span
                    key={i}
                    className="absolute select-none"
                    style={{
                        left: d.x,
                        top: d.y,
                        fontSize: d.size,
                        color: d.char === "♥" ? "#D6708A" : "#C9A24B",
                        rotate: `${d.rotate}deg`,
                    }}
                    animate={
                        reduce
                            ? undefined
                            : {
                                  y: [0, -14, 0],
                                  opacity: [0.5, 0.85, 0.5],
                              }
                    }
                    transition={{
                        duration: 5 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: d.delay,
                    }}
                >
                    {d.char}
                </motion.span>
            ))}
        </div>
    );
}
