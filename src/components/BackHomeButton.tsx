"use client";

import Link from "next/link";

export default function BackHomeButton() {
    return (
        <Link
            href="/"
            className="
                fixed left-5 top-5 z-50
                rounded-full border border-[#d9c19a] bg-[#fffaf0]/80
                px-4 py-1.5 text-sm text-[#7a5a38] shadow-sm backdrop-blur
                transition hover:-translate-x-1 hover:text-[#b23b53]
            "
        >
            ← our little world
        </Link>
    );
}
