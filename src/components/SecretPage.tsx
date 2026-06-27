"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { unlockTreasure } from "@/utils/progress";
import AnimatedPage from "./AnimatedPage";
import BackHomeButton from "./BackHomeButton";
import MemoryUnlockOverlay from "./MemoryUnlockOverlay";
import VoiceNote from "./scrapbook/VoiceNote";
import Polaroid from "./scrapbook/Polaroid";
import Tape from "./scrapbook/Tape";

export type SecretPageProps = {
    id: string;
    title: string;
    /** Short line under the title. (kept name `description` for compatibility) */
    description: string;
    audio: string;
    /** Big sticker emoji for the page header. */
    sticker?: string;
    /** Accent colour (hex) used for the title, button and sticker glow. */
    accent?: string;
    /** Longer hand-written letter, one entry per paragraph. */
    letter?: string[];
    /** Optional photos: { src, caption, emoji }. Missing images fall back to emoji. */
    photos?: { src?: string; caption?: string; emoji?: string }[];
    /** Sign-off line for the letter. */
    signoff?: string;
};

export default function SecretPage({
    id,
    title,
    description,
    audio,
    sticker = "💌",
    accent = "#b23b53",
    letter,
    photos,
    signoff = "— always yours, Samar",
}: SecretPageProps) {
    const [showUnlock, setShowUnlock] = useState(false);

    useEffect(() => {
        const isNew = unlockTreasure(id);
        if (isNew) setShowUnlock(true);

        window.dispatchEvent(
            new CustomEvent("treasure-unlocked", { detail: { id } }),
        );
    }, [id]);

    return (
        <>
            <BackHomeButton />
            <MemoryUnlockOverlay
                show={showUnlock}
                onFinish={() => setShowUnlock(false)}
                title={title}
            />
            <AnimatedPage>
                <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center px-5 pb-24 pt-24">
                    {/* sticker */}
                    <motion.div
                        initial={{ scale: 0, rotate: -20, opacity: 0 }}
                        animate={{ scale: 1, rotate: -6, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 240, damping: 12 }}
                        className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-white text-5xl shadow-lg"
                        style={{
                            background: "#fffaf0",
                            boxShadow: `0 10px 30px ${accent}33`,
                        }}
                    >
                        {sticker}
                    </motion.div>

                    {/* title + intro */}
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                        className="mt-4 text-center [font-family:var(--font-caveat)] text-6xl leading-none"
                        style={{ color: accent }}
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-2 max-w-md text-center text-xl text-[#7a5a38]"
                    >
                        {description}
                    </motion.p>

                    {/* letter */}
                    {letter && letter.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.55 }}
                            className="relative mt-9 w-full rotate-[0.4deg] rounded-[16px] border border-[#e3cfa6] bg-[#fffaf0] p-7 shadow-[0_14px_40px_rgba(120,80,40,0.18)]"
                        >
                            <Tape className="left-1/2 -top-3 -translate-x-1/2 rotate-[3deg]" />
                            {letter.map((para, i) => (
                                <p
                                    key={i}
                                    className="mt-3 text-lg leading-relaxed text-[#5b4632] first:mt-0"
                                >
                                    {para}
                                </p>
                            ))}
                            <p
                                className="mt-4 text-right [font-family:var(--font-caveat)] text-2xl"
                                style={{ color: "#8a6f53" }}
                            >
                                {signoff}
                            </p>
                        </motion.div>
                    )}

                    {/* photos */}
                    {photos && photos.length > 0 && (
                        <div className="mt-9 flex flex-wrap items-start justify-center gap-5">
                            {photos.map((p, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 24, rotate: 0 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    whileHover={{ scale: 1.04, rotate: 0 }}
                                    className="w-40"
                                >
                                    <Polaroid
                                        src={p.src}
                                        caption={p.caption}
                                        emoji={p.emoji ?? sticker}
                                        rotate={i % 2 === 0 ? -3 : 3}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* voice note */}
                    <div className="mt-10 w-full">
                        <VoiceNote src={audio} accent={accent} />
                    </div>
                </main>
            </AnimatedPage>
        </>
    );
}
