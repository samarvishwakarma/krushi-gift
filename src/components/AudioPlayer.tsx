type AudioPlayerProps = {
    src: string;
};

export default function AudioPlayer({ src }: AudioPlayerProps) {
    return (
        <audio controls className="w-full mt-4">
            <source src={src} type="audio/mpeg" />
            Your browser does not support audio playback.
        </audio>
    );
}