"use client";

import { useEffect, useState } from "react";
import { treasures } from "@/data/treasures";
import { getUnlockedTreasures } from "@/utils/progress";

export default function TreasureProgress() {
    const [unlocked, setUnlocked] = useState<string[]>([]);

    useEffect(() => {
        setUnlocked(getUnlockedTreasures());
    }, []);

    const progress =
        (unlocked.length / treasures.length) * 100;

    return (
        <div className="w-full max-w-xl">
            <div className="mb-6">
                <div className="flex justify-between mb-2">
                    <span>Treasure Progress</span>
                    <span>
                        {unlocked.length}/{treasures.length}
                    </span>
                </div>

                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-pink-400"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
            <div className="space-y-2">
                {treasures.map((treasure) => {
                    const isUnlocked = unlocked.includes(treasure.id);

                    return (
                        <div
                            key={treasure.id}
                            className="flex justify-between items-center border border-slate-700 rounded-xl px-4 py-3"
                        >
                            <span className="flex items-center gap-2">
                                <span>{treasure.emoji}</span>

                                <span className={
                                    isUnlocked
                                        ? ""
                                        : "blur-[1px] select-none"
                                }>
                                    {isUnlocked
                                        ? treasure.title
                                        : "???????"}
                                </span>
                            </span>

                            <span>
                                {isUnlocked ? "✅" : "🔒"}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}