import SecretPage from "@/components/SecretPage";

export default function Page() {
    return (
        <SecretPage
            id="random-day"
            title="A Random Day"
            description="Not your birthday. Not an anniversary. Just a Tuesday I love you on."
            sticker="🎧"
            accent="#C9912C"
            audio="/audio/random-day.mp3"
            letter={[
                "I love you more than I could ever fit into the big days, so here's a little something for an ordinary one.",
                "Press play. Pretend I'm there, humming off-key, just happy it's a day that has you in it.",
            ]}
        />
    );
}
