import SecretPage from "@/components/SecretPage";

export default function Page() {
    return (
        <SecretPage
            id="landour"
            title="Landour"
            description="What I couldn't fit on the postcard."
            sticker="🏔️"
            accent="#3F6B73"
            audio="/audio/landour.mp3"
            letter={[
                "The postcard ran out of space about three words in, because there is no small way to say what those hills felt like with you.",
                "I keep the quiet of that place folded up in my chest — the cold mornings, the slow walks, your hand finding mine. If I ever seem far away, I'm probably back up there in my head, with you.",
            ]}
            photos={[
                { src: "/photos/landour-1.jpg", caption: "the foggy morning", emoji: "🌫️" },
                { src: "/photos/landour-2.jpg", caption: "us, freezing & happy", emoji: "🧣" },
            ]}
        />
    );
}
