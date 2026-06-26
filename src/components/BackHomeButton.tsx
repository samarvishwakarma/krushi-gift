"use client";

import Link from "next/link";

export default function BackHomeButton() {
    return (
        <Link
            href="/"
            className="
                fixed top-6 left-7
                text-white/50 hover:text-white
                text-sm transition
                z-50
                hover:-translate-x-2
            "
        >
            ← Our Little World
        </Link>
    );
}