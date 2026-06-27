import SecretPage from "@/components/SecretPage";

export default function Page() {
    return (
        <SecretPage
            id="calendar"
            title="Our Calendar"
            description="What I couldn't fit on the calendar."
            sticker="📅"
            accent="#b23b53"
            audio="/audio/calendar.mp3"
            letter={[
                "Every square is too small for what those days actually held. So consider this the margin notes — the laughs, the fights, the making-up, the ordinary magic.",
                "Here's to filling a hundred more pages with you. I'll bring the pen if you bring the days.",
            ]}
        />
    );
}
