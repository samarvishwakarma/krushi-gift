const STORAGE_KEY = "unlocked";

export function getUnlockedTreasures(): string[] {
    if (typeof window === "undefined") return [];

    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

export function isTreasureUnlocked(id: string): boolean {
    return getUnlockedTreasures().includes(id);
}

export function unlockTreasure(id: string): boolean {
    const current = getUnlockedTreasures();

    // already unlocked → return false (important!)
    if (current.includes(id)) {
        return false;
    }

    console.log(id)

    const updated = [...current, id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return true; // NEW unlock happened
}