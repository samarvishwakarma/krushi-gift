import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
            <div className="max-w-xl text-center">

                <div className="text-7xl mb-4">
                    🕵️‍♀️
                </div>

                <h1 className="text-7xl font-bold mb-4">
                    404
                </h1>

                <h2 className="text-3xl font-bold mb-6">
                    Uh huh Krushi... No 😏
                </h2>

                <p className="text-slate-300 mb-3">
                    You thought you could just guess the URL?
                </p>

                <p className="text-slate-400 mb-8">
                    Some memories are earned, not typed.
                </p>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8">
                    <p className="text-sm text-slate-400">
                        ⚠️ Detective Krushi Alert
                    </p>

                    <p className="mt-2">
                        Suspicious activity detected:
                    </p>

                    <ul className="mt-3 space-y-1 text-left inline-block">
                        <li>✓ Guessing URLs</li>
                        <li>✓ Looking for secrets</li>
                        <li>✓ Being excessively cute</li>
                    </ul>
                </div>

                <p className="text-pink-300 mb-8">
                    Psst... if you're seeing this,
                    you're definitely my girlfriend ❤️
                </p>

                <Link
                    href="/"
                    className="inline-block rounded-xl bg-pink-600 px-6 py-3 font-medium hover:bg-pink-500 transition"
                >
                    Return to Our Little World
                </Link>

            </div>
        </main>
    );
}