import { Caveat, Patrick_Hand } from "next/font/google";
import NavsariStory from "./NavsariStory";

const caveat = Caveat({
    subsets: ["latin"],
    variable: "--font-caveat",
    weight: ["400", "500", "600", "700"],
});

const patrickHand = Patrick_Hand({
    subsets: ["latin"],
    variable: "--font-patrick",
    weight: "400",
});

export default function Page() {
    return (
        <div className={`${caveat.variable} ${patrickHand.variable}`}>
            <NavsariStory />
        </div>
    );
}
