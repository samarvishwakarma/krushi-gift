import SecretPage from "@/components/SecretPage";

export default function Page() {
    return (
        <SecretPage
            id="homesick"
            title="Open When You're Homesick"
            description="For the days you miss home, miss mom, miss the smell of rain on the soil."
            sticker="🏠"
            accent="#7C8B4A"
            audio="/audio/homesick.mp3"
            letter={[
                "I know that ache — when home feels like a place you can only visit in your memory. I wish I could carry you there.",
                "Until then, let me be a little piece of home. Wherever I am, there's always a door open for you.",
            ]}
        />
    );
}
