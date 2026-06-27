import SecretPage from "@/components/SecretPage";

export default function Page() {
    return (
        <SecretPage
            id="found-one"
            title="Treasure Found"
            description="You found another secret. I knew you would."
            sticker="🗝️"
            accent="#C9912C"
            audio="/audio/found-one.mp3"
            letter={[
                "Look at you, detective. Following the little clues, turning over every corner of our world.",
                "That's exactly how you found me too — paying attention when you didn't have to. Keep going. There's more of us to discover.",
            ]}
        />
    );
}
