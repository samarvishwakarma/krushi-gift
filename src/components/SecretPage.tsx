"use client";

import { useEffect } from "react";
import AudioPlayer from "./AudioPlayer";
import { unlockTreasure } from "@/utils/progress";

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
    useEffect(() => {
        unlockTreasure(id);
    }, [id]);

    return (
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
            <div className="max-w-xl w-full border rounded-3xl p-8">
                <h1 className="text-3xl font-bold">
                    {title}
                </h1>

                <p className="mt-4">
                    {description}
                </p>

                <AudioPlayer src={audio} />
            </div>
        </main>
    );
}