import SecretPage from "@/components/SecretPage";

export default function Page() {
    return (
        <SecretPage
            id="truce"
            title="Truce"
            description="I'm sorry for everything I said. I didn't mean any of it."
            sticker="🕊️"
            accent="#5b8a8f"
            audio="/audio/truce.mp3"
            letter={[
                "I let my words get sharp when my heart was actually just scared. That wasn't fair to you, and I'm sorry.",
                "You matter more to me than being right ever will. White flag, raised. Can we start over — with a hug this time?",
            ]}
            signoff="— sorry & still yours, Samar"
        />
    );
}
