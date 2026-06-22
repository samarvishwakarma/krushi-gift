"use client";

import { useEffect, useState } from "react";
import { treasures } from "@/data/treasures";
import { getUnlockedTreasures } from "@/utils/progress";

export default function TreasureProgress() {
    const [unlocked, setUnlocked] =
        useState<string[]>([]);

    useEffect(() => {
        setUnlocked(getUnlockedTreasures());
    }, []);

    return (
        <div className="space-y-3">
            {treasures.map((treasure) => (
                <div key={treasure}>
                    {unlocked.includes(treasure)
                        ? "☑"
                        : "☐"}{" "}
                    {treasure}
                </div>
            ))}
        </div>
    );
}