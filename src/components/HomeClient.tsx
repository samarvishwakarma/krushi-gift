"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUnlockedTreasures } from "@/utils/progress";
import TreasureProgress from "@/components/TreasureProgress";
import AnimatedPage from "./AnimatedPage";

export default function HomeClient() {
    const [unlocked, setUnlocked] = useState<string[]>([]);

    useEffect(() => {
        getUnlockedTreasures().then(setUnlocked);
    }, []);

    const count = unlocked.length;

    return (
        <AnimatedPage>
            <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center px-6 py-16">
                <motion.div
                    initial={{ scale: 0, rotate: -12, opacity: 0 }}
                    animate={{ scale: 1, rotate: -4, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 12 }}
                    className="text-6xl"
                >
                    🧳
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="mt-2 text-center [font-family:var(--font-caveat)] text-6xl leading-none text-[#b23b53] sm:text-7xl"
                >
                    Our Little World
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="mt-1 text-lg text-[#8a6f53]"
                >
                    For Krushi, from Samar.
                </motion.p>

                <motion.p
                    key={count}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-5 mb-8 text-center text-xl text-[#7a5a38]"
                >
                    {count <= 1 && "A few secrets are hidden around you 👀"}
                    {count > 1 && count < 5 && "You've started collecting our memories ✨"}
                    {count >= 5 && count < 9 && "You're getting closer... 👀"}
                    {count === 9 && "Just one secret remains... 😳"}
                    {count === 10 && "You found them all ❤️"}
                </motion.p>

                <TreasureProgress />
            </main>
        </AnimatedPage>
    );
}
