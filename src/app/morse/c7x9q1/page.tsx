import SecretPage from "@/components/SecretPage";

export default function Page() {
    return (
        <SecretPage
            id="morse"
            title="Morse Code"
            description="The pendant with my name in morse code."
            sticker="📿"
            accent="#8a5a7a"
            audio="/audio/morse.mp3"
            letter={[
                "I hid my name against your heart in little dots and dashes, so even on the days we don't talk, I'm still right there.",
                "· – – · — it spells more than my name. It spells: I'm yours, quietly, all the time.",
            ]}
            photos={[
                { src: "/photos/memories/morse.jpg", caption: "the pendant", emoji: "📿" },
            ]}
        />
    );
}
