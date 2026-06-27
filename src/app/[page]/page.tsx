import type { ComponentType } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { isPage, isUnlocked, cookieName, PAGES, type PageId } from "@/lib/gate";
import PasswordForm from "@/components/gate/PasswordForm";

// The actual page content (same components the secret UID routes render).
import Navsari from "../navsari/b8k1p4/page";
import Landour from "../landour/l9f2a7/page";
import Morse from "../morse/c7x9q1/page";
import RandomDay from "../random-day/f2m8z5/page";
import Calendar from "../calendar/k9r4w2/page";
import MissMe from "../miss-me/p8d4x7/page";
import Homesick from "../homesick/m3z7k1/page";
import Truce from "../truce/h5v2q9/page";
import FoundOne from "../found-one/j8w6n3/page";
import FinalSecret from "../final-secret/x4r7t2/page";

const COMPONENTS: Record<PageId, ComponentType> = {
    navsari: Navsari,
    landour: Landour,
    morse: Morse,
    "random-day": RandomDay,
    calendar: Calendar,
    "miss-me": MissMe,
    homesick: Homesick,
    truce: Truce,
    "found-one": FoundOne,
    "final-secret": FinalSecret,
};

export default async function GatedPage({
    params,
}: {
    params: Promise<{ page: string }>;
}) {
    const { page } = await params;
    if (!isPage(page)) notFound();

    const jar = await cookies();
    if (isUnlocked(page, jar.get(cookieName(page))?.value)) {
        const Content = COMPONENTS[page];
        return <Content />;
    }

    return <PasswordForm page={page} title={PAGES[page].title} />;
}
