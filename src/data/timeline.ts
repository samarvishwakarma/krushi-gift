export type MediaKind = "photo" | "video" | "link";
export type MediaItem = { type: MediaKind; url: string; caption?: string };

export type TimelineKind = "past" | "milestone" | "future";

export type TimelineEntry = {
    id: string; // seed id (stable string) or db uuid
    date: string; // YYYY-MM-DD
    title: string;
    note?: string;
    kind: TimelineKind;
    emoji?: string;
    media?: MediaItem[];
    source: "seed" | "db";
};

/**
 * The day my world got its first star — everything before this is the dark,
 * starless "before you" era. EDIT THIS to the real date.
 */
export const ORIGIN_DATE = "2024-09-29";

/**
 * Samar's fixed timeline entries. Add/adjust freely — these can't be edited
 * from the browser (only DB entries can). Dates are YYYY-MM-DD.
 */
export const SEED_ENTRIES: TimelineEntry[] = [
    {
        id: "origin",
        date: ORIGIN_DATE,
        title: "The day my sky lit up",
        note: "We matched on Schmooze. At that moment we were just two strangers looking to pass time, with no expectations of where this would lead. Neither of us knew this simple swipe would become one of the most important moments of my life.",
        kind: "milestone",
        media: [{ type: "photo", url: "/photos/calendar/schmooze.png" }],
        source: "seed",
        emoji: "✨",
    },
    {
        id: "first-chat",
        date: "2024-09-30",
        title: "A conversation that never wanted to end",
        note: "Around 9:44 PM, I sent my first messages: 'I was hoping we would match' and 'Btw you have a cute smile.' You replied with a simple 'Thank you.' What started as a casual conversation between two strangers slowly became hours of effortless chatting. Neither of us wanted the conversation to end that night.",
        kind: "milestone",
        source: "seed",
        emoji: "💬",
    },
    {
        id: "honest-strangers",
        date: "2024-09-30",
        title: "Two honest strangers",
        note: "From the very beginning, we promised each other that we weren't looking for love. We were simply two strangers trying to pass time. Ironically, that honesty made us comfortable enough to open up about our lives without pretending to impress one another.",
        kind: "past",
        source: "seed",
        emoji: "🤝",
    },
    {
        id: "daily-routine",
        date: "2024-10-01",
        title: "Becoming each other's everyday",
        note: "Talking became part of our daily routine. We shared our work, college life, family stories, random thoughts, childhood memories, ambitions, and even the smallest moments of our day. Without realizing it, we slowly became each other's favorite notification.",
        kind: "past",
        source: "seed",
        emoji: "🌸",
    },
    {
        id: "linkedin-stalker",
        date: "2024-10-02",
        title: "Sherlock Ma'am",
        note: "You first claimed you didn't have any social media, but later admitted that you had found my LinkedIn just by searching my first name and company. Then you challenged me to find yours. After searching through countless profiles from Navsari, I finally found your hidden LinkedIn profile. You laughed because it took me much longer than it took you, and that's when I started calling you 'Sherlock Ma'am.'",
        kind: "past",
        source: "seed",
        emoji: "🕵️‍♀️",
    },
    {
        id: "number-rejected",
        date: "2024-10-05",
        title: "The pickup line that almost worked",
        note: "I gathered enough courage to ask for your phone number using my permutation and combination pickup line. You smiled through your reply but politely said no—it was still too early to trust someone from the internet. I respected your answer, and we simply continued talking like nothing had happened.",
        kind: "past",
        source: "seed",
        emoji: "🙈",
    },
    {
        id: "garba-updates",
        date: "2024-10-04",
        title: "Garba nights from miles away",
        note: "Navratri had filled Navsari with music and lights. Even though rain spoiled many evenings, whenever you managed to go to Garba with your college friends and Aastha, you kept updating me throughout the night. Without realizing it, you made me feel like I was celebrating those Garba nights with you from hundreds of kilometers away.",
        kind: "past",
        source: "seed",
        emoji: "💃",
    },
    {
        id: "dog-story",
        date: "2024-10-08",
        title: "The great dog escape",
        note: "During a Garba break, you and Aastha rode your scooter to grab some snacks, only to find yourselves surrounded by a group of street dogs. The two of you immediately took a U-turn and escaped while laughing uncontrollably. You rushed to tell me the story, and we laughed together as if I had been there with you.",
        kind: "past",
        source: "seed",
        emoji: "🐶",
    },
    {
        id: "deepest-conversation",
        date: "2024-10-08",
        title: "The day we spoke about everything",
        note: "This was the day our conversations reached another level. We talked about friends, family, studies, careers, relationships, our past experiences, fears, dreams, and everything in between. It no longer felt like two strangers chatting on a dating app—it felt like two souls genuinely trying to understand each other.",
        kind: "milestone",
        source: "seed",
        emoji: "❤️",
    },
    {
        id: "number-puzzle",
        date: "2024-10-08",
        title: "The number puzzle",
        note: "That evening you surprised me by bringing back my old pickup line. Instead of simply giving me your phone number, you hid two digits and challenged me to solve the puzzle using multiples of five. I filled pages with possible combinations, checked my very first guess on Truecaller, and somehow got it right. Seeing 'Krushi M' appear on my screen felt like unlocking a secret level of our story.",
        kind: "milestone",
        source: "seed",
        emoji: "🧩",
    },
    {
        id: "reverse-challenge",
        date: "2024-10-08",
        title: "Your turn to solve it",
        note: "When you asked me to call, I decided to tease you back. Since I had earned your number by solving your puzzle, I made you earn mine too. I shared only part of my number and gave you clues. What started as exchanging phone numbers became our own little game, filled with laughter and playful competition.",
        kind: "past",
        source: "seed",
        emoji: "🎲",
    },
    {
        id: "first-call",
        date: "2024-10-08",
        title: "Hello... is this Samar speaking?",
        note: "Around 9:30–10:00 PM, my phone finally rang. I answered, and the first thing I heard was, 'Hello... is this Samar speaking?' I completely froze. After days of reading your words on a screen, hearing your voice made everything feel real. It was the beginning of a completely different chapter in our story.",
        kind: "milestone",
        source: "seed",
        emoji: "📞",
    },
    // Example — replace with your real memories:
    // {
    //   id: "first-call",
    //   date: "2024-10-12",
    //   title: "Our first call",
    //   note: "Three hours felt like three minutes.",
    //   kind: "past",
    //   media: [{ type: "photo", url: "/photos/calendar/first-call.jpg" }],
    //   source: "seed",
    // },
    {
        id: "someday",
        date: "2026-12-31",
        title: "Someday, us",
        note: "A dream I'm not telling you yet. It unlocks when the day comes. 🤍",
        kind: "future",
        source: "seed",
    },
];
