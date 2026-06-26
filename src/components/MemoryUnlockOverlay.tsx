"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";

type Props = {
    show: boolean;
    onFinish: () => void;
};

export default function MemoryUnlockOverlay({ show, onFinish }: Props) {
    useEffect(() => {
        if (!show) return;

        // 🎉 confetti burst
        const duration = 2500;
        const end = Date.now() + duration;

        const interval = setInterval(() => {
            confetti({
                particleCount: 40,
                spread: 100,
                startVelocity: 30,
                origin: {
                    x: Math.random(),
                    y: Math.random() * 0.6,
                },
                zIndex: 100
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
                    className="fixed inset-0 z-99 flex items-center justify-center bg-black/70 backdrop-blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="
                            text-center
                            px-10 py-8
                            rounded-3xl
                            bg-white/10
                            border border-white/20
                            shadow-2xl
                            backdrop-blur-xl
                            z-101
                        "
                    >
                        <h1 className="text-2xl font-bold text-white">
                            ✨ New Memory Found
                        </h1>

                        <p className="text-white/70 mt-2">
                            Unlocking...
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}