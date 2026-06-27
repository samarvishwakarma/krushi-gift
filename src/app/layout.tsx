import type { Metadata } from "next";
import { Caveat, Patrick_Hand } from "next/font/google";
import "./globals.css";
import PaperBackground from "@/components/scrapbook/PaperBackground";

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

export const metadata: Metadata = {
  title: "Krushi's and Samar's Little World",
  description:
    "Welcome to Krushi's and Samar's Little World—a place where smiles grow, memories are made, and every moment is cherished.❤️",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${caveat.variable} ${patrickHand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-[#5b4632]">
        <PaperBackground />
        {children}
      </body>
    </html>
  );
}
