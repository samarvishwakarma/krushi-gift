"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEditMode } from "./EditModeProvider";
import SpriteSheet from "@/components/scrapbook/SpriteSheet";

const IDLE_MS = 6000; // show the mascot after this much inactivity

/** Floating pencil (bottom-right) to unlock / leave edit mode. */
export default function EditToggle() {
    const { editing, unlock, lock } = useEditMode();
    const [asking, setAsking] = useState(false);
    const [value, setValue] = useState("");
    const [error, setError] = useState(false);
    const [busy, setBusy] = useState(false);
    const [idle, setIdle] = useState(false);

    // Detect inactivity; a mascot peeks out from behind the button when idle
    // (only while NOT in edit mode).
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        const arm = () => {
            setIdle(false);
            clearTimeout(timer);
            timer = setTimeout(() => setIdle(true), IDLE_MS);
        };
        const events = ["mousemove", "keydown", "scroll", "pointerdown", "touchstart"];
        events.forEach((e) => window.addEventListener(e, arm, { passive: true }));
        arm();
        return () => {
            clearTimeout(timer);
            events.forEach((e) => window.removeEventListener(e, arm));
        };
    }, []);

    const showMascot = idle && !editing && !asking;
    const glow = idle && !editing;

    const submit = async () => {
        setBusy(true);
        setError(false);
        const ok = await unlock(value.trim());
        setBusy(false);
        if (ok) {
            setAsking(false);
            setValue("");
        } else {
            setError(true);
        }
    };

    return (
        <>
            {/* idle mascot peeking from behind the button (no rotation) */}
            <AnimatePresence>
                {showMascot && (
                    <motion.div
                        aria-hidden
                        className="pointer-events-none fixed -bottom-40 -right-35 z-85"
                        initial={{ y: 1, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 1, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 140, damping: 16 }}
                    >
                        <SpriteSheet
                            src="/sprites/lookhere.png"
                            frameWidth={1536 / 4}
                            frameHeight={1024 / 2}
                            frames={8}
                            columns={4}
                            fps={1}
                            scale={0.3}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                type="button"
                onClick={() => (editing ? lock() : setAsking(true))}
                className={`fixed bottom-5 right-10 z-90 flex h-12 w-12 items-center justify-center rounded-full border text-xl transition hover:scale-105 ${editing
                    ? "border-[#b23b53] bg-[#b23b53] text-white"
                    : "border-[#d9c19a] bg-[#fffaf0]/85 text-[#8a6f53] backdrop-blur"
                    }`}
                animate={
                    glow
                        ? {
                              boxShadow: [
                                  "0 6px 18px rgba(0,0,0,0.15)",
                                  "0 0 22px 6px rgba(178,59,83,0.55)",
                                  "0 6px 18px rgba(0,0,0,0.15)",
                              ],
                          }
                        : { boxShadow: "0 6px 18px rgba(0,0,0,0.15)" }
                }
                transition={
                    glow
                        ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.3 }
                }
                title={editing ? "Leave edit mode" : "Unlock edit mode"}
                aria-label={editing ? "Leave edit mode" : "Unlock edit mode"}
            >
                {editing ? "✓" : "✎"}
            </motion.button>

            <AnimatePresence>
                {asking && (
                    <motion.div
                        className="fixed inset-0 z-95 flex items-center justify-center bg-[#3a2417]/45 backdrop-blur-sm p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setAsking(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-xs rounded-2xl border border-[#e7d4b0] bg-[#fffaf0] p-6 text-center shadow-[0_18px_50px_rgba(120,70,30,0.35)]"
                        >
                            <div className="text-3xl">🔑</div>
                            <h2 className="mt-2 [font-family:var(--font-caveat)] text-2xl text-[#b23b53]">
                                Secret word
                            </h2>
                            <p className="mt-1 text-sm text-[#8a6f53]">
                                Enter the secret to edit our world.
                            </p>
                            <input
                                type="password"
                                autoFocus
                                value={value}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    setError(false);
                                }}
                                onKeyDown={(e) => e.key === "Enter" && submit()}
                                className={`mt-4 w-full rounded-lg border bg-white px-3 py-2 text-center outline-none ${error ? "border-red-400" : "border-[#e0cba2]"
                                    }`}
                                placeholder="••••••"
                            />
                            {error && (
                                <p className="mt-1 text-sm text-red-500">
                                    That&apos;s not it 💔
                                </p>
                            )}
                            <button
                                type="button"
                                onClick={submit}
                                disabled={busy || !value.trim()}
                                className="mt-4 w-full rounded-full bg-[#b23b53] py-2 font-medium text-white transition hover:scale-[1.02] disabled:opacity-50"
                            >
                                {busy ? "Checking…" : "Unlock"}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
