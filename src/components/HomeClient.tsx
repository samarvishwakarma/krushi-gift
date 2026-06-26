"use client";

import { useEffect, useState } from "react";
import { getUnlockedTreasures } from "@/utils/progress";
import TreasureProgress from "@/components/TreasureProgress";
import AnimatedPage from "./AnimatedPage";

export default function HomeClient() {
    const [unlocked, setUnlocked] = useState<string[]>([]);

    useEffect(() => {
        setUnlocked(getUnlockedTreasures());
    }, []);

    const count = unlocked.length;

    return (
        <AnimatedPage>
            <main className="min-h-screen text-white flex flex-col items-center justify-center p-8">
                <h1 className="text-5xl font-bold mb-2 text-center">
                    Our Little World ❤️
                </h1>
                <h3 className="text-lg font-normal mb-6">
                    For Krushi, from Samar.
                </h3>

                <p className="text-center mb-6 text-slate-300">
                    {count <= 1 && "A few secrets are hidden around you 👀"}
                    {count > 1 && count < 5 && "You've started discovering the memories ✨"}
                    {count >= 5 && count < 9 && "You're getting closer... 👀"}
                    {count === 9 && "Just one secret remains... 😳"}
                    {count === 10 && "You found them all ❤️"}
                </p>

                <TreasureProgress />
            </main>
        </AnimatedPage>
    );
}