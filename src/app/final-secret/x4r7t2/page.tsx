import SecretPage from "@/components/SecretPage";

export default function Page() {
    return (
        <SecretPage
            id="final-secret"
            title="The Final Secret"
            description="You found them all. Of course you did. Now — the last one."
            sticker="🎁"
            accent="#B9473A"
            audio="/audio/final-secret.mp3"
            letter={[
                "Every secret you opened was really just me saying the same thing in different ways: I'm so completely in love with you.",
                "So here's the final one, no riddle this time. You are my favourite person, my home, my whole little world. Thank you for finding all of me.",
            ]}
            signoff="— forever yours, Samar ❤️"
        />
    );
}
