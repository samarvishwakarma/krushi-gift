import { getUnlockedTreasures } from "@/utils/progress";
import TreasureProgress from "@/components/TreasureProgress";

export default function HomePage() {
  const unlocked = getUnlockedTreasures();
  const count = unlocked.length;

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-4">
        Our Little World ❤️
      </h1>

      <p className="text-center mb-6 text-slate-300">
        {count === 0 &&
          "A few secrets are hidden around you ❤️"}
        {count > 0 &&
          count < 5 &&
          "You've started discovering the memories ✨"}
        {count >= 5 &&
          count < 9 &&
          "You're getting closer... 👀"}
        {count === 9 &&
          "Just one secret remains... ❤️"}
        {count === 10 &&
          "You found them all ❤️"}
      </p>

      <TreasureProgress />
    </main>
  );
}