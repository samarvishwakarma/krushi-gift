"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";

type Props = {
    show: boolean;
    onFinish: () => void;
    title?: string;
};

export default function MemoryUnlockOverlay({ show, onFinish, title }: Props) {
    useEffect(() => {
        if (!show) return;

        const duration = 2200;
        const end = Date.now() + duration;

        const interval = setInterval(() => {
            confetti({
                particleCount: 36,
                spread: 95,
                startVelocity: 28,
                colors: ["#D6486A", "#C07048", "#E7B84B", "#B9473A", "#7C8B4A"],
                origin: {
                    x: Math.random(),
                    y: Math.random() * 0.6,
                },
                zIndex: 200,
            });

            if (Date.now() > end) {
                onFinish();
                clearInterval(interval);
            }
        }, 200);

        return () => clearInterval(interval);
    }, [show]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-120 flex items-center justify-center bg-[#3a2417]/55 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.7, rotate: -6, opacity: 0 }}
                        animate={{ scale: 1, rotate: -2, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 220, damping: 16 }}
                        className="rounded-[18px] border border-[#e7d4b0] bg-[#fffaf0] px-10 py-8 text-center shadow-[0_18px_50px_rgba(120,70,30,0.35)]"
                    >
                        <div className="text-4xl">✨📖</div>
                        <h2 className="mt-3 [font-family:var(--font-caveat)] text-3xl text-[#b23b53]">
                            A new memory unlocked
                        </h2>
                        <p className="mt-1 text-[#8a6f53]">
                            {title ?? "Adding it to our little world…"}
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
