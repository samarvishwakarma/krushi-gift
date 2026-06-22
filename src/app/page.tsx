import TreasureProgress from "@/components/TreasureProgress";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-6">
        Our Little World ❤️
      </h1>

      <TreasureProgress />
    </main>
  );
}