/** A strip of washi tape for sticking scrapbook elements down. */
export default function Tape({ className = "" }: { className?: string }) {
    return (
        <span
            className={`pointer-events-none absolute h-6 w-16 bg-[#e9d49a]/60 shadow-sm ${className}`}
            style={{
                backgroundImage:
                    "repeating-linear-gradient(45deg, rgba(255,255,255,0.25) 0 6px, transparent 6px 12px)",
            }}
        />
    );
}
