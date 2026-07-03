"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
    /** Path under /public, e.g. "/sprites/detective.png" */
    src: string;
    frameWidth: number;
    frameHeight: number;
    frames: number;
    /** how many frames per row in the sheet */
    columns: number;
    fps?: number;
    scale?: number;
    className?: string;
};

/**
 * Plays a sprite-sheet animation (any grid layout) via requestAnimationFrame.
 * If the image is missing, it renders nothing — so pages look fine until you
 * drop the real sheet into /public/sprites.
 *
 * Sheet format: all frames the same size, packed left→right, top→bottom.
 */
export default function SpriteSheet({
    src,
    frameWidth,
    frameHeight,
    frames,
    columns,
    fps = 10,
    scale = 1,
    className = "",
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.onload = () => setReady(true);
        img.onerror = () => setFailed(true);
        img.src = src;
    }, [src]);

    useEffect(() => {
        if (!ready) return;
        const el = ref.current;
        if (!el) return;
        let raf = 0;
        let last = 0;
        let idx = 0;
        const interval = 1000 / fps;

        const step = (t: number) => {
            if (!last) last = t;
            if (t - last >= interval) {
                last = t;
                idx = (idx + 1) % frames;
                const col = idx % columns;
                const row = Math.floor(idx / columns);
                el.style.backgroundPosition = `${-col * frameWidth}px ${-row * frameHeight}px`;
            }
            raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [ready, frames, columns, fps, frameWidth, frameHeight]);

    if (failed) return null;

    return (
        <div
            ref={ref}
            aria-hidden
            className={className}
            style={{
                width: frameWidth,
                height: frameHeight,
                backgroundImage: `url(${src})`,
                backgroundRepeat: "no-repeat",
                transform: `scale(${scale})`,
                opacity: ready ? 1 : 0,
                transition: "opacity .4s ease",
                imageRendering: "auto",
            }}
        />
    );
}
