import SecretPage from "@/components/SecretPage";

export default function Page() {
    return (
        <SecretPage
            id="found-one"
            title="Treasure Found 🎉"
            description="You found the another secret. I knew you would."
            audio="/audio/found-one.mp3"
        />
    );
}