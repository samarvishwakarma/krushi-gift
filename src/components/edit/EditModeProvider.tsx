"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

type EditCtx = {
    editing: boolean;
    /** Try to unlock with a secret. Returns true on success. */
    unlock: (secret: string) => Promise<boolean>;
    lock: () => void;
    /** fetch() wrapper that attaches the editor secret header. */
    editFetch: (input: string, init?: RequestInit) => Promise<Response>;
};

const Ctx = createContext<EditCtx | null>(null);
const STORAGE_KEY = "editor-secret";

export function EditModeProvider({ children }: { children: ReactNode }) {
    const [secret, setSecret] = useState<string | null>(null);

    // Restore a previously unlocked session.
    useEffect(() => {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) setSecret(saved);
    }, []);

    const unlock = useCallback(async (candidate: string) => {
        const res = await fetch("/api/editor", {
            headers: { "x-editor-secret": candidate },
        });
        if (!res.ok) return false;
        sessionStorage.setItem(STORAGE_KEY, candidate);
        setSecret(candidate);
        return true;
    }, []);

    const lock = useCallback(() => {
        sessionStorage.removeItem(STORAGE_KEY);
        setSecret(null);
    }, []);

    const editFetch = useCallback(
        (input: string, init: RequestInit = {}) =>
            fetch(input, {
                ...init,
                headers: {
                    ...(init.headers ?? {}),
                    ...(secret ? { "x-editor-secret": secret } : {}),
                },
            }),
        [secret],
    );

    const value = useMemo(
        () => ({ editing: Boolean(secret), unlock, lock, editFetch }),
        [secret, unlock, lock, editFetch],
    );

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEditMode() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useEditMode must be used within EditModeProvider");
    return ctx;
}
