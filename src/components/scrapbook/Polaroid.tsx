"use client";

import { useState } from "react";

type Props = {
    src?: string;
    caption?: string;
    emoji?: string;
    rotate?: number;
    className?: string;
};

/**
 * A polaroid frame. Shows the photo at `src`; if it is missing or fails to
 * load, it gracefully falls back to a big emoji placeholder so the page never
 * shows a broken-image icon (photos can be dropped into /public later).
 */
export default function Polaroid({
    src,
    caption,
    emoji = "📷",
    rotate = -2,
    className = "",
}: Props) {
    const [failed, setFailed] = useState(false);
    const showImage = src && !failed;

    return (
        <div
            className={`inline-block rounded-[4px] border border-[#eadcc0] bg-white p-2 pb-3 shadow-[0_10px_28px_rgba(120,70,30,0.25)] ${className}`}
            style={{ rotate: `${rotate}deg` }}
        >
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-[#f1e7d3]">
                {showImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={src}
                        alt={caption ?? ""}
                        draggable={false}
                        className="pointer-events-none h-full w-full select-none object-cover"
                        style={{ WebkitUserDrag: "none" } as React.CSSProperties}
                        onError={() => setFailed(true)}
                    />
                ) : (
                    <span className="text-5xl opacity-70">{emoji}</span>
                )}
            </div>
            {caption && (
                <p className="mt-2 text-center [font-family:var(--font-caveat)] text-xl leading-tight text-[#7a5a38]">
                    {caption}
                </p>
            )}
        </div>
    );
}
