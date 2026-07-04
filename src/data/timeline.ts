export type MediaKind = "photo" | "video" | "audio" | "link";
export type MediaItem = { type: MediaKind; url: string; caption?: string };

export type Song = { title: string; url?: string };

export type TravelMode = "Train" | "Flight" | "Car" | "Bike" | "Walk";
export type Travel = {
    from?: string;
    to?: string;
    mode?: TravelMode;
    duration?: string;
};

export type Feelings = { samar?: string[]; krushi?: string[] };

export type TimelineKind = "past" | "milestone" | "future";

/**
 * A day in our story — a living archive entry. Only `id/date/title/kind/source`
 * are required; everything else is optional and revealed in the detail view.
 */
export type TimelineEntry = {
    id: string; // seed id (stable string) or db uuid
    date: string; // YYYY-MM-DD
    title: string;
    kind: TimelineKind;
    source: "seed" | "db";

    subtitle?: string;
    note?: string;
    emoji?: string;

    hisMemory?: string; // what Samar felt
    herMemory?: string; // what Krushi felt
    funnyMoment?: string;
    favoriteQuote?: string;

    location?: string;
    weather?: string;
    mood?: string;
    importance?: number; // 1–5
    map?: string; // a maps link or "lat,lon"

    relationshipStage?: string; // Stranger | Friends | Best Friends | Situationship | Couple | LDR
    travel?: Travel;
    gifts?: string[];
    feelings?: Feelings; // short feeling words, per person
    firsts?: string[]; // "first call", "first trip"…
    timelineOrder?: number; // manual tiebreaker for same-day entries

    tags?: string[];
    peoplePresent?: string[];
    songs?: Song[];

    media?: MediaItem[]; // photos / videos / audio / links / chat screenshots
};

/** Fields stored inside the DB `details` JSONB column (everything but the core). */
export const DETAIL_KEYS = [
    "subtitle",
    "hisMemory",
    "herMemory",
    "funnyMoment",
    "favoriteQuote",
    "location",
    "weather",
    "mood",
    "importance",
    "map",
    "relationshipStage",
    "travel",
    "gifts",
    "feelings",
    "firsts",
    "timelineOrder",
    "tags",
    "peoplePresent",
    "songs",
] as const;

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
        subtitle: "A random swipe that changed everything.",
        note: "We matched on Schmooze. At that moment we were just two strangers looking to pass time, with no expectations of where this would lead. Neither of us knew this simple swipe would become one of the most important moments of our lives.",
        kind: "milestone",
        source: "seed",
        emoji: "✨",

        relationshipStage: "Strangers",

        hisMemory:
            "It was just another match on a dating app. I never imagined this would become the most important swipe of my life.",

        herMemory:
            "Another stranger on Schmooze. Nothing serious, just someone interesting enough to match with.",

        funnyMoment:
            "Neither of us came to the app looking for love... yet here we are.",

        favoriteQuote:
            "We were only here to pass time.",

        location: "Schmooze",
        mood: "Curious",
        importance: 5,

        tags: [
            "match",
            "schmooze",
            "beginning"
        ],

        peoplePresent: [
            "Samar",
            "Krushi"
        ],

        firsts: [
            "First match"
        ],

        media: [
            {
                type: "photo",
                url: "/photos/calendar/schmooze.png"
            }
        ]
    },

    {
        id: "first-chat",
        date: "2024-09-30",
        title: "A conversation that never wanted to end",
        subtitle: "9:44 PM — the first hello.",
        note: "Around 9:44 PM, I finally texted you: 'I was hoping we would match.' A few seconds later came, 'Btw you have a cute smile.' You simply replied with 'Thank you.' That tiny conversation quietly turned into hours of effortless chatting, and without realizing it, neither of us wanted the night to end.",
        kind: "milestone",
        source: "seed",
        emoji: "💬",

        relationshipStage: "Strangers",

        hisMemory:
            "I was nervous before sending the first message, but once the conversation started, it just flowed naturally.",

        herMemory:
            "His opening message felt genuine instead of forced. It made replying easy.",

        funnyMoment:
            "The very first compliment became the start of thousands of messages.",

        favoriteQuote:
            "\"I was hoping we would match.\"",

        location: "Schmooze",

        mood: "Excited",

        importance: 5,

        tags: [
            "first message",
            "compliment",
            "conversation"
        ],

        peoplePresent: [
            "Samar",
            "Krushi"
        ],

        firsts: [
            "First message",
            "First compliment"
        ]
    },

    {
        id: "honest-strangers",
        date: "2024-09-30",
        title: "Two honest strangers",
        subtitle: "No expectations. No promises.",
        note: "Very early in our conversations, we both admitted that we weren't looking for a relationship. We were simply talking to strangers to pass time. Ironically, that honesty became the strongest foundation of everything that followed.",
        kind: "past",
        source: "seed",
        emoji: "🤝",

        relationshipStage: "Strangers",

        hisMemory:
            "Knowing there was no pressure made it easier to be completely myself.",

        herMemory:
            "She didn't have to pretend or impress anyone. She could simply be herself.",

        favoriteQuote:
            "\"We're not here for dating. Just time pass.\"",


        mood: "Comfortable",

        importance: 4,

        tags: [
            "honesty",
            "friendship",
            "trust"
        ],

        peoplePresent: [
            "Samar",
            "Krushi"
        ]
    },

    {
        id: "daily-routine",
        date: "2024-10-01",
        title: "Becoming each other's everyday",
        subtitle: "One day turned into every day.",
        note: "Without either of us noticing, talking became a daily habit. We shared work, college, family, dreams, random thoughts, and the smallest details of our day. Slowly, we became each other's favorite notification.",
        kind: "past",
        source: "seed",
        emoji: "🌸",

        relationshipStage: "Friends",

        hisMemory:
            "I found myself checking my phone hoping she'd text.",

        herMemory:
            "Updating Samar about her day slowly became natural.",

        mood: "Warm",

        importance: 5,

        tags: [
            "daily chats",
            "routine",
            "friendship"
        ],

        peoplePresent: [
            "Samar",
            "Krushi"
        ]
    },

    {
        id: "linkedin-stalker",
        date: "2024-10-02",
        title: "Sherlock Ma'am",
        subtitle: "She found me first.",
        note: "You said you didn't have social media, but later admitted you had already found my LinkedIn just by searching my first name and company. Then you challenged me to find yours. After searching through countless Navsari profiles, I finally found it. You laughed because it took me far longer than it took you, and that's when I started calling you 'Sherlock Ma'am.'",
        kind: "past",
        source: "seed",
        emoji: "🕵️‍♀️",

        relationshipStage: "Friends",

        hisMemory:
            "Finding her profile felt like solving a treasure hunt.",

        herMemory:
            "Watching him struggle to find my profile was hilarious.",

        funnyMoment:
            "She found me in seconds. I became a LinkedIn detective for hours.",

        favoriteQuote:
            "\"Oho Sherlock Ma'am.\"",

        mood: "Playful",

        importance: 4,

        tags: [
            "linkedin",
            "inside joke",
            "sherlock"
        ],

        peoplePresent: [
            "Samar",
            "Krushi"
        ]
    },

    {
        id: "number-rejected",
        date: "2024-10-05",
        title: "The pickup line that almost worked",
        subtitle: "The first 'No.'",
        note: "I finally gathered the courage to ask for your phone number using my permutation and combination pickup line. You politely refused because it was still too early to trust someone from the internet. I respected your decision, and we happily continued talking like nothing had happened.",
        kind: "past",
        source: "seed",
        emoji: "🙈",

        relationshipStage: "Friends",

        hisMemory:
            "I was disappointed for a second, but honestly respected her even more for being careful.",

        herMemory:
            "She liked the creativity, but trusted her instincts to take things slowly.",

        favoriteQuote:
            "\"Could you rearrange 0123456789?\"",

        mood: "Hopeful",

        importance: 4,

        tags: [
            "pickup line",
            "phone number",
            "trust"
        ],

        peoplePresent: [
            "Samar",
            "Krushi"
        ]
    },

    {
        id: "garba-updates",
        date: "2024-10-07",
        title: "Garba nights from miles away",
        subtitle: "Navsari danced, Palghar watched.",
        note: "It was Navratri in Navsari. Even while enjoying Garba with her college and society friends, Krushi kept updating me throughout the night with photos, videos and little moments. Somehow, despite being hundreds of kilometers apart, she made me feel like I was celebrating beside her.",
        kind: "past",
        source: "seed",
        emoji: "💃",

        relationshipStage: "Friends",

        hisMemory:
            "Every photo and video she sent made me wish I was actually there dancing beside her.",

        herMemory:
            "Sharing those moments with Samar felt natural. She wanted him to experience her favorite festival too.",

        favoriteQuote:
            "\"Aaja Navsari.\"",


        location: "Navsari",

        mood: "Festive",

        importance: 5,

        tags: [
            "garba",
            "navratri",
            "videos"
        ],

        peoplePresent: [
            "Krushi",
            "Aastha"
        ]
    },

    {
        id: "dog-story",
        date: "2024-10-08",
        title: "The great dog escape",
        subtitle: "Scooter vs street dogs.",
        note: "During a Garba break, Krushi and Aastha rode their scooter to grab snacks but suddenly found themselves surrounded by street dogs. They immediately took a U-turn and escaped while laughing. She couldn't wait to tell me the story, and we laughed together for hours.",
        kind: "past",
        source: "seed",
        emoji: "🐶",

        relationshipStage: "Friends",

        hisMemory:
            "Her storytelling made me laugh as if I'd actually witnessed the whole scene.",

        herMemory:
            "It was scary for a moment, but became hilarious the second she told Samar.",

        funnyMoment:
            "The fastest U-turn in Navsari history.",

        mood: "Funny",

        importance: 3,

        tags: [
            "dogs",
            "aastha",
            "garba"
        ],

        peoplePresent: [
            "Krushi",
            "Aastha"
        ]
    },

    {
        id: "deepest-conversation",
        date: "2024-10-08",
        title: "The day we spoke about everything",
        subtitle: "No more strangers.",
        note: "This day completely changed our conversations. We talked about friends, family, studies, careers, dreams, fears, relationships and our past. We probably exchanged more messages than the previous week combined. It no longer felt like two strangers talking on a dating app—it felt like two people genuinely trying to understand each other.",
        kind: "milestone",
        source: "seed",
        emoji: "❤️",

        relationshipStage: "Friends",

        hisMemory:
            "That day I realized I genuinely wanted to know everything about her.",

        herMemory:
            "She found someone she could comfortably tell almost anything.",

        mood: "Deep",

        importance: 5,

        tags: [
            "deep talk",
            "future",
            "family"
        ],

        peoplePresent: [
            "Samar",
            "Krushi"
        ]
    },

    {
        id: "number-puzzle",
        date: "2024-10-08",
        title: "The number puzzle",
        subtitle: "A challenge worth solving.",
        note: "That evening she unexpectedly brought back my old pickup line and finally decided to give me her number—but only partially. She hid two digits and challenged me to solve it using multiples of five. I filled pages with combinations, checked the first guess on Truecaller, and unbelievably got it right.",
        kind: "milestone",
        source: "seed",
        emoji: "🧩",

        relationshipStage: "Friends",

        hisMemory:
            "Getting the correct number on my first attempt felt like winning a lottery.",

        herMemory:
            "She genuinely couldn't believe he'd solved it so quickly.",

        funnyMoment:
            "He literally used a notebook to solve my phone number.",

        favoriteQuote:
            "\"Krushi M\"",

        mood: "Excited",

        importance: 5,

        tags: [
            "phone number",
            "truecaller",
            "puzzle"
        ],

        peoplePresent: [
            "Samar",
            "Krushi"
        ],

        firsts: [
            "Phone number exchange"
        ]
    },

    {
        id: "reverse-challenge",
        date: "2024-10-08",
        title: "Your turn to solve it",
        subtitle: "Fair is fair.",
        note: "When she asked me to call, I decided to tease her back. Since I'd worked hard to get her number, I made her work for mine too. I hid a few digits and gave her clues. It turned into another silly game that only we could have enjoyed so much.",
        kind: "past",
        source: "seed",
        emoji: "🎲",

        relationshipStage: "Friends",

        funnyMoment:
            "Neither of us wanted to make getting a phone number easy.",

        mood: "Playful",

        importance: 3,

        tags: [
            "reverse challenge",
            "phone number"
        ],

        peoplePresent: [
            "Samar",
            "Krushi"
        ]
    },

    {
        id: "first-call",
        date: "2024-10-08",
        title: "Hello... is this Samar speaking?",
        subtitle: "The voice behind the texts.",
        note: "Around 9:30 PM, my phone rang. I answered and heard her say, 'Hello... is this Samar speaking?' I completely froze. After days of reading her words on a screen, hearing her voice made everything feel incredibly real. It was the beginning of a whole new chapter.",
        kind: "milestone",
        source: "seed",
        emoji: "📞",

        relationshipStage: "Friends",

        hisMemory:
            "I went completely blank. I had imagined her voice, but hearing it was something else entirely.",

        herMemory:
            "She finally called the boy who had spent days making her laugh.",

        favoriteQuote:
            "\"Hello... is this Samar speaking?\"",

        mood: "Butterflies",

        importance: 5,

        tags: [
            "first call",
            "voice"
        ],

        peoplePresent: [
            "Samar",
            "Krushi"
        ],

        firsts: [
            "First phone call"
        ]
    },

    {
        id: "first-video-call",
        date: "2024-10-26",
        title: "The face behind the voice",
        subtitle: "Happy Birthday, Krushi.",
        note: "On Krushi's birthday, we finally turned our cameras on for the first time. Until then we'd only heard each other's voices and seen a few photos. Seeing each other smile, laugh and react in real time made everything feel much more personal. The person behind the screen had finally become real.",
        kind: "milestone",
        source: "seed",
        emoji: "🎥",

        relationshipStage: "Friends",

        hisMemory:
            "I was nervous before the call, but the moment I saw her smile, every bit of nervousness disappeared.",

        herMemory:
            "She finally met the face she'd only imagined while reading thousands of messages.",

        favoriteQuote:
            "\"Happy Birthday. ❤️\"",

        mood: "Special",

        importance: 5,

        tags: [
            "birthday",
            "video call",
            "first video"
        ],

        peoplePresent: [
            "Samar",
            "Krushi"
        ],

        firsts: [
            "First video call",
            "First time seeing each other live"
        ]
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
