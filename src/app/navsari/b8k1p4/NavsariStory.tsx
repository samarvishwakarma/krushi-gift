"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { unlockTreasure } from "@/utils/progress";
import VoiceNote from "@/components/scrapbook/VoiceNote";
import Tape from "@/components/scrapbook/Tape";
import { useEditMode } from "@/components/edit/EditModeProvider";
import type { Kind, Landmark } from "./NavsariMap";

type DbPin = {
    id: string;
    name: string;
    note: string | null;
    lat: number;
    lon: number;
    kind: string;
    emoji: string | null;
    photo_url: string | null;
};

const KIND_EMOJI: Record<Kind, string> = {
    home: "🏠",
    place: "📍",
    food: "🍽️",
    heart: "💗",
};

function toLandmark(p: DbPin): Landmark {
    const kind = (["home", "place", "food", "heart"].includes(p.kind) ? p.kind : "place") as Kind;
    return {
        id: p.id,
        name: p.name,
        lat: p.lat,
        lon: p.lon,
        kind,
        emoji: p.emoji || KIND_EMOJI[kind],
        note: p.note || "",
        photo: p.photo_url || undefined,
    };
}

// Leaflet touches `window`, so load the map only on the client.
const NavsariMap = dynamic(() => import("./NavsariMap"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center text-[#a98a63]">
            unfolding the map…
        </div>
    ),
});

/* Landmarks — real Navsari coordinates from our map. */
const LANDMARKS: Landmark[] = [
    { name: "Home", lat: 20.941086698428638, lon: 72.93932352788028, emoji: "🏠", kind: "home", note: "where every map starts and ends 💛", photo: "/photos/navsari/home.jpg" },
    { name: "Railway Station", lat: 20.94778239647084, lon: 72.91421025993772, emoji: "🚂", kind: "place", note: "long hugs and 'text me when you reach'", photo: "/photos/navsari/railway.jpg" },
    { name: "Foot Over Bridge", lat: 20.94465853798939, lon: 72.91438548637079, emoji: "🚧", kind: "heart", note: "gande kaam, kaat daali mujhe", photo: "/photos/navsari/bridge.jpg" },
    { name: "SS Agarwal", lat: 20.94052662222671, lon: 72.95071210041814, emoji: "🎓", kind: "place", note: "the place you least been to", photo: "/photos/navsari/ss-agarwal.jpg" },
    { name: "AB School", lat: 20.90676607531754, lon: 72.93305028692413, emoji: "🎓", kind: "place", note: "before we even knew the other existed", photo: "/photos/navsari/ab-school.jpg" },
    { name: "Vidyakunj School", lat: 20.93690419238448, lon: 72.9393025176085, emoji: "🎓", kind: "place", note: "tiny uniforms, big dreams", photo: "/photos/navsari/vidyakunj.jpg" },
    { name: "Locho", lat: 20.951330822827575, lon: 72.93049994385545, emoji: "🥣", kind: "food", note: "Surti locho > almost everything", photo: "/photos/navsari/locho.jpg" },
    { name: "Bhajiyawala", lat: 20.952523937399814, lon: 72.93389585321096, emoji: "🥟", kind: "food", note: "kachori + you", photo: "/photos/navsari/bhajiyawala.jpg" },
    { name: "Pantaloons", lat: 20.929561769426613, lon: 72.94539704336385, emoji: "🛍️", kind: "place", note: "you tried on nine things, bought none", photo: "/photos/navsari/pantaloons.jpg" },
    { name: "Popo's Cafe", lat: 20.913847334737635, lon: 72.95875636788539, emoji: "☕", kind: "food", note: "teen ghante bas baithe-baithe nikaal diye", photo: "/photos/navsari/popos.jpg" },
    { name: "Coco / Frankie", lat: 20.952443948162728, lon: 72.93207682802834, emoji: "🌯", kind: "food", note: "mumbai ka cold coco better hain😝", photo: "/photos/navsari/coco.jpg" },
    { name: "Natural Icecream", lat: 20.95114443422331, lon: 72.94224159815158, emoji: "🍦", kind: "food", note: "one scoop, two spoons", photo: "/photos/navsari/natural.jpg" },
    { name: "Dmart", lat: 20.940406084140907, lon: 72.9479074274053, emoji: "🛒", kind: "place", note: "the most romantic grocery list", photo: "/photos/navsari/dmart.jpg" },
    { name: "Prime Mega Mart", lat: 20.91952500655076, lon: 72.93089669766285, emoji: "🛒", kind: "place", note: "Maaza pike maza aaya", photo: "/photos/navsari/primemart.jpg" },
    { name: "Nescafe", lat: 20.920792703835772, lon: 72.94995025624037, emoji: "☕", kind: "food", note: "thappad se darr nahi lagta sahab!", photo: "/photos/navsari/nescafe.jpg" },
    { name: "Mr Bake", lat: 20.946020073662226, lon: 72.93142321241217, emoji: "🧁", kind: "food", note: "hum toh cream bread khayege!!!!", photo: "/photos/navsari/mr-bake.jpg" },
    { name: "McDonald's", lat: 20.96487292449138, lon: 72.96356856158172, emoji: "🍟", kind: "food", note: "fries are a love language", photo: "/photos/navsari/mcdonalds.jpg" },
    { name: "PiPizza", lat: 20.923937866016928, lon: 72.96165566603719, emoji: "🍕", kind: "food", note: "barish + overoder pizza", photo: "/photos/navsari/pipizza.jpg" },
    { name: "Sorry", lat: 20.91925145413493, lon: 72.91948946110506, emoji: "💗", kind: "heart", note: "where I feared the most, yet found the warmest hug 🫂", photo: "/photos/navsari/accident.jpg" },
    { name: "Quick Raincheck", lat: 20.92098830363941, lon: 72.88844108137911, emoji: "💗", kind: "heart", note: "where I first thought of kissing you 😳", photo: "/photos/navsari/raincheck.jpg" },
    { name: "Heart Place", lat: 20.921853636566347, lon: 72.87993247139669, emoji: "💗", kind: "heart", note: "all the way out here, still us 💕", photo: "/photos/navsari/dandi.jpg" },
    { name: "Heart Place", lat: 20.92482000455073, lon: 72.96462990777793, emoji: "💗", kind: "heart", note: "a secret only we know 🌙", photo: "/photos/navsari/pappis.jpg" },
    { name: "Heart Place", lat: 20.91203026389213, lon: 72.9316130762978, emoji: "💗", kind: "heart", note: "where the world went quiet 🤍", photo: "/photos/navsari/schoolpappis.jpg" },
];

export default function NavsariStory() {
    const [showUnlock, setShowUnlock] = useState(false);
    const { editing, editFetch } = useEditMode();
    const [dbPins, setDbPins] = useState<Landmark[]>([]);
    const [pending, setPending] = useState<
        | { mode: "add"; lat: number; lon: number }
        | { mode: "edit"; pin: Landmark }
        | null
    >(null);

    // Load user-added pins (empty until Supabase is configured).
    useEffect(() => {
        fetch("/api/pins?page=navsari")
            .then((r) => r.json())
            .then((d) => {
                if (Array.isArray(d?.pins)) setDbPins(d.pins.map(toLandmark));
            })
            .catch(() => { });
    }, []);

    const pins = useMemo(() => [...LANDMARKS, ...dbPins], [dbPins]);

    const handleAddAt = useCallback(
        (lat: number, lon: number) => setPending({ mode: "add", lat, lon }),
        [],
    );

    const handleEdit = useCallback(
        (id: string) => {
            const pin = dbPins.find((x) => x.id === id);
            if (pin) setPending({ mode: "edit", pin });
        },
        [dbPins],
    );

    const handleDelete = useCallback(
        async (id: string) => {
            const res = await editFetch(`/api/pins/${id}`, { method: "DELETE" });
            if (res.ok) setDbPins((p) => p.filter((x) => x.id !== id));
        },
        [editFetch],
    );

    const savePin = useCallback(
        async (form: { name: string; note: string; kind: Kind; emoji: string }) => {
            if (!pending) return;
            if (pending.mode === "edit") {
                const res = await editFetch(`/api/pins/${pending.pin.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
                const d = await res.json().catch(() => null);
                if (res.ok && d?.pin) {
                    const updated = toLandmark(d.pin);
                    setDbPins((p) => p.map((x) => (x.id === updated.id ? updated : x)));
                    setPending(null);
                } else {
                    alert(d?.error || "Could not save the pin.");
                }
                return;
            }
            const res = await editFetch("/api/pins", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ page: "navsari", lat: pending.lat, lon: pending.lon, ...form }),
            });
            const d = await res.json().catch(() => null);
            if (res.ok && d?.pin) {
                setDbPins((p) => [...p, toLandmark(d.pin)]);
                setPending(null);
            } else {
                alert(d?.error || "Could not save the pin.");
            }
        },
        [editFetch, pending],
    );

    useEffect(() => {
        let active = true;
        unlockTreasure("navsari").then((isNew) => {
            if (active && isNew) setShowUnlock(true);
        });
        window.dispatchEvent(
            new CustomEvent("treasure-unlocked", { detail: { id: "navsari" } }),
        );
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!showUnlock) return;
        const end = Date.now() + 1800;
        const interval = setInterval(() => {
            confetti({
                particleCount: 30,
                spread: 90,
                startVelocity: 28,
                colors: ["#D6486A", "#C07048", "#E7B84B", "#B9473A"],
                origin: { x: Math.random(), y: Math.random() * 0.5 },
                zIndex: 200,
            });
            if (Date.now() > end) {
                setShowUnlock(false);
                clearInterval(interval);
            }
        }, 220);
        return () => clearInterval(interval);
    }, [showUnlock]);

    return (
        <div className="relative min-h-screen [font-family:var(--font-patrick)] text-[#5b4632]">
            {/* unlock overlay */}
            <AnimatePresence>
                {showUnlock && (
                    <motion.div
                        className="fixed inset-0 z-120 flex items-center justify-center bg-[#3a2417]/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.7, rotate: -6, opacity: 0 }}
                            animate={{ scale: 1, rotate: -2, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 220, damping: 16 }}
                            className="rounded-[18px] border border-[#e7d4b0] bg-[#fffaf0] px-10 py-8 text-center shadow-[0_18px_50px_rgba(120,70,30,0.35)]"
                        >
                            <div className="text-4xl">📍❤️</div>
                            <h2 className="mt-3 text-3xl [font-family:var(--font-caveat)] text-[#b23b53]">
                                A new memory unlocked
                            </h2>
                            <p className="mt-1 text-[#8a6f53]">Navsari — our little world</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Link
                href="/"
                className="fixed left-5 top-5 z-50 rounded-full border border-[#d9c19a] bg-[#fffaf0]/80 px-4 py-1.5 text-sm text-[#7a5a38] shadow-sm backdrop-blur transition hover:-translate-x-1 hover:text-[#b23b53]"
            >
                ← our little world
            </Link>

            <main className="mx-auto max-w-5xl px-5 pb-24 pt-20">
                {/* header */}
                <motion.header
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative text-center"
                >
                    <p className="text-lg tracking-[0.3em] text-[#a98a63] uppercase">
                        a map of us
                    </p>
                    <h1 className="[font-family:var(--font-caveat)] text-7xl leading-none text-[#b23b53] sm:text-8xl">
                        Navsari
                    </h1>
                    <p className="mx-auto mt-2 max-w-md text-xl text-[#7a5a38]">
                        the most special place in my life — and every little corner of
                        it that has a piece of us. 🤍
                    </p>

                    <div className="mx-auto mt-5 inline-flex -rotate-3 flex-col items-center rounded-md border-2 border-dashed border-[#cdb084] bg-[#fffaf0] px-4 py-2 shadow-sm">
                        <span className="text-2xl">🏠</span>
                        <span className="text-xs tracking-wider text-[#9a7c54]">
                            20.93° N · 72.93° E
                        </span>
                    </div>
                </motion.header>

                {/* the interactive map */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                    className="relative mx-auto mt-10 w-full rotate-[-0.6deg] rounded-[20px] border border-[#e3cfa6] bg-[#fdf6e6] p-3 shadow-[0_20px_55px_rgba(120,80,40,0.22)]"
                >
                    <Tape className="-left-4 -top-3 rotate-[-18deg] z-500" />
                    <Tape className="-right-4 -top-3 rotate-16 z-500" />

                    <div className="h-[clamp(420px,68vh,640px)] w-full overflow-hidden rounded-[14px]">
                        <NavsariMap
                            pins={pins}
                            editing={editing}
                            onAddAt={handleAddAt}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>

                    <p className="mt-2 text-center text-sm text-[#a98a63]">
                        {editing
                            ? "✎ edit mode — tap an empty spot to drop a new memory pin"
                            : "drag to wander · pinch or scroll to zoom · tap a pin to open the memory · the little hearts are ours to find 💗"}
                    </p>
                </motion.div>

                {/* handwritten letter */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6 }}
                    className="relative mx-auto mt-12 max-w-2xl rotate-[0.5deg] rounded-[16px] border border-[#e3cfa6] bg-[#fffaf0] p-7 shadow-[0_14px_40px_rgba(120,80,40,0.18)]"
                >
                    <Tape className="left-1/2 -top-3 -translate-x-1/2 rotate-3" />
                    <h3 className="[font-family:var(--font-caveat)] text-3xl text-[#b23b53]">
                        Dear Krushi,
                    </h3>
                    <p className="mt-2 text-lg leading-relaxed text-[#5b4632]">
                        Every street here remembers something about you. Some days, I
                        think about those places and they feel louder than usual, like
                        they&apos;re holding onto us too. This is my way of pinning all of
                        it down, so we never lose a single one.
                    </p>
                    <p className="mt-3 text-right [font-family:var(--font-caveat)] text-2xl text-[#8a6f53]">
                        — always yours, Samar
                    </p>
                </motion.div>

                {/* voice note */}
                <div className="mt-10">
                    <VoiceNote src="/audio/navsari.mp3" />
                </div>
            </main>

            <AddPinModal
                open={Boolean(pending)}
                mode={pending?.mode ?? "add"}
                initial={pending?.mode === "edit" ? pending.pin : undefined}
                onCancel={() => setPending(null)}
                onSave={savePin}
            />
        </div>
    );
}

function AddPinModal({
    open,
    mode = "add",
    initial,
    onCancel,
    onSave,
}: {
    open: boolean;
    mode?: "add" | "edit";
    initial?: Landmark;
    onCancel: () => void;
    onSave: (f: { name: string; note: string; kind: Kind; emoji: string }) => Promise<void>;
}) {
    const [name, setName] = useState("");
    const [note, setNote] = useState("");
    const [kind, setKind] = useState<Kind>("place");
    const [emoji, setEmoji] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (open) {
            setName(initial?.name ?? "");
            setNote(initial?.note ?? "");
            setKind(initial?.kind ?? "place");
            setEmoji(initial?.emoji ?? "");
        }
    }, [open, initial]);

    const save = async () => {
        if (!name.trim()) return;
        setBusy(true);
        await onSave({ name: name.trim(), note: note.trim(), kind, emoji: emoji.trim() });
        setBusy(false);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-110 flex items-center justify-center bg-[#3a2417]/45 p-6 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onCancel}
                >
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm rounded-2xl border border-[#e7d4b0] bg-[#fffaf0] p-6 shadow-[0_18px_50px_rgba(120,70,30,0.35)]"
                    >
                        <h2 className="text-center [font-family:var(--font-caveat)] text-3xl text-[#b23b53]">
                            {mode === "edit" ? "Edit this memory" : "A new memory here"}
                        </h2>
                        <label className="mt-4 block text-sm text-[#8a6f53]">Name</label>
                        <input
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Our bench"
                            className="mt-1 w-full rounded-lg border border-[#e0cba2] bg-white px-3 py-2 outline-none"
                        />
                        <label className="mt-3 block text-sm text-[#8a6f53]">Note (optional)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={2}
                            placeholder="what makes it ours…"
                            className="mt-1 w-full resize-none rounded-lg border border-[#e0cba2] bg-white px-3 py-2 outline-none"
                        />
                        <div className="mt-3 flex gap-3">
                            <div className="flex-1">
                                <label className="block text-sm text-[#8a6f53]">Type</label>
                                <select
                                    value={kind}
                                    onChange={(e) => setKind(e.target.value as Kind)}
                                    className="mt-1 w-full rounded-lg border border-[#e0cba2] bg-white px-3 py-2 outline-none"
                                >
                                    <option value="place">Place 📍</option>
                                    <option value="food">Food 🍽️</option>
                                    <option value="heart">Heart 💗</option>
                                    <option value="home">Home 🏠</option>
                                </select>
                            </div>
                            <div className="w-20">
                                <label className="block text-sm text-[#8a6f53]">Emoji</label>
                                <input
                                    value={emoji}
                                    onChange={(e) => setEmoji(e.target.value)}
                                    placeholder="🌟"
                                    className="mt-1 w-full rounded-lg border border-[#e0cba2] bg-white px-3 py-2 text-center outline-none"
                                />
                            </div>
                        </div>
                        <div className="mt-5 flex gap-3">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 rounded-full border border-[#e0cba2] py-2 text-[#8a6f53] transition hover:bg-[#f6ead2]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={save}
                                disabled={busy || !name.trim()}
                                className="flex-1 rounded-full bg-[#b23b53] py-2 font-medium text-white transition hover:scale-[1.02] disabled:opacity-50"
                            >
                                {busy ? "Saving…" : mode === "edit" ? "Save ✓" : "Drop pin 📍"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
