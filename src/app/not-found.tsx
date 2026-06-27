import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center p-8">
            <div className="relative max-w-xl rotate-[-0.6deg] rounded-[20px] border border-[#e3cfa6] bg-[#fffaf0] p-8 text-center shadow-[0_18px_50px_rgba(120,70,30,0.22)]">
                <div className="mb-3 text-7xl">🕵️‍♀️</div>

                <h1 className="[font-family:var(--font-caveat)] text-7xl leading-none text-[#b23b53]">
                    404
                </h1>

                <h2 className="mt-2 [font-family:var(--font-caveat)] text-3xl text-[#8a6f53]">
                    Uh huh Krushi... No 😏
                </h2>

                <p className="mt-4 text-lg text-[#7a5a38]">
                    You thought you could just guess the URL?
                </p>
                <p className="mt-1 text-[#9a7c54]">
                    Some memories are earned, not typed.
                </p>

                <div className="mx-auto mt-6 max-w-sm rotate-[0.5deg] rounded-2xl border border-dashed border-[#cdb084] bg-[#fdf3df] p-4 text-left">
                    <p className="text-sm text-[#9a7c54]">⚠️ Detective Krushi Alert</p>
                    <p className="mt-2 text-[#5b4632]">Suspicious activity detected:</p>
                    <ul className="mt-2 space-y-1 text-[#5b4632]">
                        <li>✓ Guessing URLs</li>
                        <li>✓ Looking for secrets</li>
                        <li>✓ Being excessively cute</li>
                    </ul>
                </div>

                <p className="mt-6 [font-family:var(--font-caveat)] text-2xl text-[#b23b53]">
                    Psst... if you&apos;re seeing this, you&apos;re definitely my
                    girlfriend ❤️
                </p>

                <Link
                    href="/"
                    className="mt-6 inline-block rounded-full bg-[#b23b53] px-6 py-3 font-medium text-white transition hover:scale-105"
                >
                    Return to Our Little World
                </Link>
            </div>
        </main>
    );
}
