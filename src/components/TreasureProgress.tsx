"use client";

import { useEffect, useState } from "react";
import { treasures } from "@/data/treasures";
import { getUnlockedTreasures } from "@/utils/progress";
import { useRouter } from "next/navigation";

export default function TreasureProgress() {
    const [unlocked, setUnlocked] = useState<string[]>([]);
    const router = useRouter();

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
                        <button
                            key={treasure.id}
                            className={`flex justify-between items-center border border-slate-700 rounded-xl px-4 py-3 w-full ${isUnlocked ? "cursor-pointer" : "cursor-not-allowed"}`}
                            disabled={!isUnlocked}
                            onClick={() => {
                                if (isUnlocked) {
                                    router.push(`/${treasure.url}`);
                                }
                            }}
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
                        </button>
                    );
                })}
            </div>
        </div>
    );
}