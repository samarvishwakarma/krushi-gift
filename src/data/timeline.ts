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
    {
        id: "first-video-call",
        date: "2024-10-26",
        title: "The face behind the voice",
        note: "It was your birthday, and for the very first time we switched on our cameras. Until then, we had only imagined each other through photos and voice calls. Seeing your smile, your expressions, and the way you laughed made everything feel even more real. It felt like meeting you in a completely new way.",
        kind: "milestone",
        source: "seed",
        emoji: "🎥",
    },
    {
        id: "first-confession",
        date: "2024-11-01",
        title: "I couldn't hide it anymore",
        note: "Somewhere between endless conversations and countless late-night calls, I realized my feelings had become much deeper than friendship. I was the first one to confess. I don't remember the exact date yet, but this was the day I stopped pretending it was just a casual friendship.",
        kind: "milestone",
        source: "seed",
        emoji: "💙",
    },
    {
        id: "first-meet",
        date: "2025-03-09",
        title: "Finally, no more screens",
        note: "After months of talking through texts and calls, we finally met in person in Navsari. Seeing you walk towards me after imagining that moment for so long felt surreal. The distance between Saphale and Navsari suddenly didn't matter anymore because you were finally standing right in front of me.",
        kind: "milestone",
        source: "seed",
        emoji: "🚉",
    },
    {
        id: "krushi-confession-like",
        date: "2025-03-23",
        title: "She said, 'I like you.'",
        note: "During a video call, you admitted something I had secretly been hoping to hear—you said you liked me. You were honest that you weren't ready to take the relationship further, but knowing those feelings existed inside your heart was enough to make me incredibly happy.",
        kind: "milestone",
        source: "seed",
        emoji: "🌷",
    },
    {
        id: "second-date",
        date: "2025-04-05",
        title: "Our imperfect perfect day",
        note: "We spent the day roaming around Navsari together. While riding downhill on the scooter, I lost control and we both fell. We got hurt, but what I remember most isn't the accident—it's how worried I became for you, and how you tightly hugged me when you saw how emotional I was. That became our very first hug.",
        kind: "milestone",
        source: "seed",
        emoji: "🫂",
    },
    {
        id: "love-confession",
        date: "2025-05-24",
        title: "The words I'd waited to hear",
        note: "After a house party with my friends on the previous night, early in the morning you finally said the words that changed everything—you told me that you loved me. It wasn't just affection anymore. It was love, and hearing it from you became one of the happiest moments of my life.",
        kind: "milestone",
        source: "seed",
        emoji: "❤️",
    },
    {
        id: "third-date",
        date: "2025-06-24",
        title: "A kiss on your forehead",
        note: "On our third date, emotions quietly spoke louder than words. Before we said goodbye, I kissed you on the forehead—a small gesture carrying every ounce of love, respect, and admiration I felt for you.",
        kind: "milestone",
        source: "seed",
        emoji: "😘",
    },
    {
        id: "fourth-date",
        date: "2025-07-02",
        title: "Every kiss except one",
        note: "We spent another beautiful day together. I couldn't stop stealing little kisses across your face—your cheeks, your forehead, everywhere except your lips. We laughed, smiled, and simply enjoyed being close to each other.",
        kind: "past",
        source: "seed",
        emoji: "🥰",
    },
    {
        id: "first-kiss",
        date: "2025-07-10",
        title: "Our first kiss",
        note: "This was the day we shared our very first kiss. It wasn't rushed or dramatic—it was simply the moment where every feeling we'd been carrying for months finally met in one unforgettable memory.",
        kind: "milestone",
        source: "seed",
        emoji: "💋",
    },
    {
        id: "sixth-date",
        date: "2025-07-18",
        title: "Another day together",
        note: "Every date had its own story, and this one was no different. By now, spending time together felt natural. The excitement of meeting had transformed into the comfort of simply existing beside each other.",
        kind: "past",
        source: "seed",
        emoji: "🌼",
    },
    {
        id: "last-goodbye",
        date: "2025-07-23",
        title: "The goodbye we thought was final",
        note: "We believed this would be our last meeting before Canada. Your sister was arriving on 1 August, and after that, meeting secretly would become almost impossible. We tried to make every minute count, not knowing fate still had one more surprise waiting for us.",
        kind: "milestone",
        source: "seed",
        emoji: "🌇",
    },
    {
        id: "surprise-navsari",
        date: "2025-08-01",
        title: "One train. Few flowers. One unforgettable surprise.",
        note: "You thought I was joking when I said I'd come to Navsari that evening. But I boarded a train from Borivali, reached Navsari around 4:30 PM, and waited at the railway station with a flower in my hand. Even after I told you I was there, you didn't believe me until you video called. When you saw me standing at the station, you were speechless. You rushed there, took the flower, hit me with it through tears, and cried as we embraced. It became one of the most unforgettable moments of our story.",
        kind: "milestone",
        source: "seed",
        emoji: "🌹",
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
