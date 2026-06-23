export function unlockTreasure(id: string) {
    if (typeof window === "undefined") return;

    const unlocked = JSON.parse(
        localStorage.getItem("unlocked") || "[]"
    );

    if (!unlocked.includes(id)) {
        unlocked.push(id);

        localStorage.setItem(
            "unlocked",
            JSON.stringify(unlocked)
        );
    }
}

export function getUnlockedTreasures(): string[] {
    if (typeof window === "undefined") return [];

    return JSON.parse(
        localStorage.getItem("unlocked") || "[]"
    );
}