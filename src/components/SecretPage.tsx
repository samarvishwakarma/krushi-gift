import AudioPlayer from "./AudioPlayer";

type SecretPageProps = {
    title: string;
    description: string;
    audio: string;
};

export default function SecretPage({
    title,
    description,
    audio,
}: SecretPageProps) {
    return (
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
            <div className="max-w-xl w-full rounded-2xl border border-slate-700 p-8">
                <h1 className="text-3xl font-bold mb-4">{title}</h1>

                <p className="text-slate-300 mb-6">{description}</p>

                <AudioPlayer src={audio} />
            </div>
        </main>
    );
}