import SecretPage from "@/components/SecretPage";

export default function Page() {
    return (
        <SecretPage
            id="miss-me"
            title="Open When You Miss Me"
            description="On the days I feel far away, press play and let me close the distance."
            sticker="💌"
            accent="#C07048"
            audio="/audio/miss-me.mp3"
            letter={[
                "If you're here, you're missing me and I want you to know the feeling is very, very mutual.",
                "Close your eyes for a second. I'm holding your hand. I'm not going anywhere. We're just on different pages of the same story.",
            ]}
        />
    );
}
