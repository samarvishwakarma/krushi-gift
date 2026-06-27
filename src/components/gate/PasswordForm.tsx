"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PasswordForm({ page, title }: { page: string; title: string }) {
    const router = useRouter();
    const [pw, setPw] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(false);

    const submit = async () => {
        if (!pw.trim()) return;
        setBusy(true);
        setError(false);
        const res = await fetch("/api/gate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page, password: pw }),
        });
        setBusy(false);
        if (res.ok) {
            router.refresh();
        } else {
            setError(true);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 24, rotate: -1 }}
                animate={{ opacity: 1, y: 0, rotate: -0.6 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-sm rounded-[20px] border border-[#e3cfa6] bg-[#fffaf0] p-8 text-center shadow-[0_18px_50px_rgba(120,70,30,0.22)]"
            >
                <div className="text-5xl">🔒</div>
                <p className="mt-3 text-sm uppercase tracking-[0.25em] text-[#a98a63]">
                    this memory is locked
                </p>
                <h1 className="mt-1 [font-family:var(--font-caveat)] text-5xl leading-none text-[#b23b53]">
                    {title}
                </h1>
                <p className="mt-3 text-[#7a5a38]">
                    You found it without the tag, clever you. Whisper the secret word
                    for this one 💗
                </p>

                <input
                    type="password"
                    autoFocus
                    value={pw}
                    onChange={(e) => {
                        setPw(e.target.value);
                        setError(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    placeholder="the secret word…"
                    className={`mt-5 w-full rounded-lg border bg-white px-3 py-2 text-center outline-none ${
                        error ? "border-red-400" : "border-[#e0cba2]"
                    }`}
                />
                {error && (
                    <p className="mt-2 text-sm text-red-500">
                        Not quite. Try again, or go find the tag 😉
                    </p>
                )}

                <button
                    type="button"
                    onClick={submit}
                    disabled={busy || !pw.trim()}
                    className="mt-4 w-full rounded-full bg-[#b23b53] py-2 font-medium text-white transition hover:scale-[1.02] disabled:opacity-50"
                >
                    {busy ? "Checking…" : "Unlock 🔑"}
                </button>

                <Link
                    href="/"
                    className="mt-5 inline-block text-sm text-[#a98a63] underline-offset-2 hover:text-[#b23b53] hover:underline"
                >
                    ← back to our little world
                </Link>
            </motion.div>
        </main>
    );
}
