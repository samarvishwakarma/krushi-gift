"use client";

import { useEffect, useState } from "react";
import AudioPlayer from "./AudioPlayer";
import { unlockTreasure } from "@/utils/progress";
import AnimatedPage from "./AnimatedPage";
import BackHomeButton from "./BackHomeButton";
import MemoryUnlockOverlay from "./MemoryUnlockOverlay";

type SecretPageProps = {
    id: string;
    title: string;
    description: string;
    audio: string;
};

export default function SecretPage({
    id,
    title,
    description,
    audio,
}: SecretPageProps) {
    const [showUnlock, setShowUnlock] = useState(false);

    useEffect(() => {
        const isNew = unlockTreasure(id);
        if (isNew) {
            setShowUnlock(true);
        }

        window.dispatchEvent(new CustomEvent("treasure-unlocked", {
            detail: { id }
        }));
    }, [id]);

    return (
        <>
            <BackHomeButton />
            <MemoryUnlockOverlay
                show={showUnlock}
                onFinish={() => setShowUnlock(false)}
            />
            <AnimatedPage>
                <main className="min-h-screen text-white flex items-center justify-center p-6">
                    <div
                        className="
                            max-w-xl w-full
                            rounded-3xl
                            p-8
                            bg-white/5
                            backdrop-blur-xl
                            border border-white/10
                            shadow-[0_8px_30px_rgb(0,0,0,0.3)]
                            transition
                            duration-1000
                            hover:border-white/20
                            hover:shadow-[0_12px_40px_rgb(236,72,153,0.15)]
                            space-y-2
                        "
                    >
                        <h1 className="text-3xl font-bold bg-linear-to-r from-white to-pink-300 bg-clip-text text-transparent">
                            {title}
                        </h1>

                        <p>
                            {description}
                        </p>

                        <AudioPlayer src={audio} />
                    </div>
                </main>
            </AnimatedPage>
        </>
    );
}