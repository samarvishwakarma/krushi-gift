"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import SpriteSheet from "./SpriteSheet";

type Corner = "bottom-left" | "bottom-right" | "top-right" | "top-left";

// Anchor each corner of the card.
const ANCHOR: Record<Corner, CSSProperties> = {
    "top-left": { top: 0, left: 0 },
    "top-right": { top: 0, right: 0 },
    "bottom-left": { bottom: 0, left: 0 },
    "bottom-right": { bottom: 0, right: 0 },
};

// Straddle the corner (~55% of the sprite sits outside).
const TRANSLATE: Record<Corner, string> = {
    "top-left": "translate(-55%, -55%)",
    "top-right": "translate(55%, -55%)",
    "bottom-left": "translate(-55%, 55%)",
    "bottom-right": "translate(55%, 55%)",
};

// Tilt so it angles diagonally out of its corner (applied instantly, no tween).
const ROT: Record<Corner, number> = {
    "top-left": -45,
    "top-right": 45,
    "bottom-left": -135,
    "bottom-right": 135,
};

const ORDER: Corner[] = ["bottom-right", "bottom-left", "top-left", "top-right"];

type Props = {
    src: string;
    frameWidth: number;
    frameHeight: number;
    frames: number;
    columns: number;
    fps?: number;
    scale?: number;
    /** how long it stays peeking before ducking away (ms) */
    holdMs?: number;
};

/**
 * A little character that peeks out of a card corner (tilted 45° along the
 * diagonal), plays its sprite animation, ducks away, then appears from the next
 * corner — looping. Sits as a sibling of the card so it isn't clipped.
 */
export default function CornerPeekSprite({
    holdMs = 2600,
    fps = 6,
    scale = 0.45,
    ...sprite
}: Props) {
    const [i, setI] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const t = setTimeout(() => setVisible(false), holdMs);
        return () => clearTimeout(t);
    }, [i, holdMs]);

    const corner = ORDER[i];
    const rot = ROT[corner];

    return (
        <div
            className="pointer-events-none absolute z-20"
            style={{ ...ANCHOR[corner], transform: `${TRANSLATE[corner]} rotate(${rot}deg)` }}
        >
            <motion.div
                aria-hidden
                initial={{ scale: 0.6, opacity: 0 }}
                animate={visible ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 16 }}
                onAnimationComplete={() => {
                    if (!visible) setI((p) => (p + 1) % ORDER.length);
                }}
            >
                <SpriteSheet {...sprite} fps={fps} scale={scale} />
            </motion.div>
        </div>
    );
}
