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
                `Motiiiii`,
                `I missed you here.`,
                `Har dusre minute laga, "Yeh moti ko dikhana hai." The chai, the tiny cafés, the pine ki smell, the silence... sab mein teri thodi si kami thi.`,
                `Landour bohot khoobsurat tha, but it would've been even better with you.`,
            ]}
            photos={[
                { src: "/photos/landour/landour-1.jpg", caption: "I missed you here 🤍", emoji: "🌫️" },
                { src: "/photos/landour/landour-2.jpg", caption: "woke up… and checked if it was you.", emoji: "🧣" },
            ]}
        />
    );
}
