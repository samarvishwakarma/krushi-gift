"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { treasures } from "@/data/treasures";
import { getUnlockedTreasures } from "@/utils/progress";
import { useRouter } from "next/navigation";

export default function TreasureProgress() {
    const [unlocked, setUnlocked] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        getUnlockedTreasures().then(setUnlocked);
    }, []);

    const progress = (unlocked.length / treasures.length) * 100;

    return (
        <div className="w-full max-w-xl">
            {/* progress meter */}
            <div className="mb-7">
                <div className="mb-2 flex items-end justify-between">
                    <span className="[font-family:var(--font-caveat)] text-2xl text-[#b23b53]">
                        memories found
                    </span>
                    <span className="text-lg text-[#8a6f53]">
                        {unlocked.length}/{treasures.length}
                    </span>
                </div>

                <div className="h-4 w-full overflow-hidden rounded-full border border-[#e0cba2] bg-[#f1e3c8]">
                    <motion.div
                        className="h-full rounded-full"
                        style={{
                            background:
                                "linear-gradient(90deg,#E08AA0,#b23b53)",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                </div>
            </div>

            {/* treasure cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {treasures.map((treasure, i) => {
                    const isUnlocked = unlocked.includes(treasure.id);

                    return (
                        <motion.button
                            key={treasure.id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.35 }}
                            whileHover={
                                isUnlocked
                                    ? { rotate: [-1, 1.5, -1], scale: 1.03 }
                                    : { rotate: [-1, 1, -1] }
                            }
                            className={`relative flex items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-left transition ${
                                isUnlocked
                                    ? "cursor-pointer border-[#e0cba2] bg-[#fffaf0] shadow-[0_8px_22px_rgba(120,80,40,0.16)]"
                                    : "cursor-not-allowed border-dashed border-[#cbb588] bg-[#efe2c6]"
                            }`}
                            disabled={!isUnlocked}
                            onClick={() => {
                                if (isUnlocked) router.push(`/${treasure.url}`);
                            }}
                            style={{ rotate: `${(i % 3) - 1}deg` }}
                        >
                            <span className="flex items-center gap-3">
                                <span className="text-2xl">
                                    {isUnlocked ? treasure.emoji : "✉️"}
                                </span>
                                <span
                                    className={`[font-family:var(--font-caveat)] text-2xl leading-none ${
                                        isUnlocked
                                            ? "text-[#5b4632]"
                                            : "select-none text-[#a08a63] blur-[1px]"
                                    }`}
                                >
                                    {isUnlocked ? treasure.title : "? ? ? ? ?"}
                                </span>
                            </span>

                            <span className="text-lg">
                                {isUnlocked ? "💝" : "🔒"}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
