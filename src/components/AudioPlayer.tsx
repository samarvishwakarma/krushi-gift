"use client";

import { useRef, useState } from "react";

type Props = {
    src: string;
};

export default function AudioPlayer({ src }: Props) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);

    const toggle = () => {
        if (!audioRef.current) return;

        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }

        setPlaying(!playing);
    };

    return (
        <div className="mt-6 p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">

            <p className="text-white/60 text-sm mb-3">
                A voice from Samar ❤️
            </p>

            <audio ref={audioRef} src={src} />

            <button
                onClick={toggle}
                className="
                    w-full py-3 rounded-xl
                    bg-pink-500/20
                    hover:bg-pink-500/30
                    border border-pink-300/30
                    text-white
                    transition
                    cursor-pointer
                "
            >
                {playing ? "Pause ⏸" : "Play ▶"}
            </button>
        </div>
    );
}