#!/bin/bash

set -e

echo "🚀 Creating Krushi Gift project structure..."

# Public folders

mkdir -p public/audio
mkdir -p public/images/landour
mkdir -p public/images/navsari
mkdir -p public/images/memories

# Source folders

mkdir -p src/components
mkdir -p src/data
mkdir -p src/types
mkdir -p src/utils

# Route folders

mkdir -p src/app/landour/l9f2a7
mkdir -p src/app/navsari/b8k1p4
mkdir -p src/app/morse/c7x9q1
mkdir -p src/app/random-day/f2m8z5
mkdir -p src/app/calendar/k9r4w2
mkdir -p src/app/miss-me/p8d4x7
mkdir -p src/app/homesick/m3z7k1
mkdir -p src/app/truce/h5v2q9
mkdir -p src/app/found-one/j8w6n3
mkdir -p src/app/final-secret/x4r7t2

# AudioPlayer component

cat > src/components/AudioPlayer.tsx <<'EOF'
type Props = {
src: string;
};

export default function AudioPlayer({ src }: Props) {
return ( <audio controls className="w-full mt-4"> <source src={src} type="audio/mpeg" />
Your browser does not support audio playback. </audio>
);
}
EOF

# Home page

cat > src/app/page.tsx <<'EOF'
export default function HomePage() {
return ( <main className="min-h-screen flex flex-col items-center justify-center p-8"> <h1 className="text-4xl font-bold mb-6">
Hidden Messages ❤️ </h1>

```
  <p>Welcome to our little world.</p>
</main>
```

);
}
EOF

# Function to create secret pages

create_page() {
local folder="$1"
local title="$2"
local audio="$3"

cat > "$folder/page.tsx" <<EOF
import AudioPlayer from "@/components/AudioPlayer";

export default function Page() {
return ( <main className="max-w-2xl mx-auto p-8"> <h1 className="text-3xl font-bold">$title</h1>

```
  <p className="mt-4">
    Secret message unlocked.
  </p>

  <AudioPlayer src="/audio/$audio.mp3" />
</main>
```

);
}
EOF
}

# Create pages

create_page src/app/landour/l9f2a7 "Landour ❤️" "landour"
create_page src/app/navsari/b8k1p4 "Navsari ❤️" "navsari"
create_page src/app/morse/c7x9q1 "Morse Code ❤️" "morse"
create_page src/app/random-day/f2m8z5 "Random Day ❤️" "random-day"
create_page src/app/calendar/k9r4w2 "Shared Calendar ❤️" "calendar"
create_page src/app/miss-me/p8d4x7 "Open When You Miss Me ❤️" "miss-me"
create_page src/app/homesick/m3z7k1 "Open When You're Homesick ❤️" "homesick"
create_page src/app/truce/h5v2q9 "Open When We Have A Fight ❤️" "truce"
create_page src/app/found-one/j8w6n3 "Treasure Found 🎉" "found-one"
create_page src/app/final-secret/x4r7t2 "Final Secret 🎁" "final-secret"

# Placeholder audio files

touch public/audio/landour.mp3
touch public/audio/navsari.mp3
touch public/audio/morse.mp3
touch public/audio/random-day.mp3
touch public/audio/calendar.mp3
touch public/audio/miss-me.mp3
touch public/audio/homesick.mp3
touch public/audio/truce.mp3
touch public/audio/found-one.mp3
touch public/audio/final-secret.mp3

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Available Routes:"
echo "/landour/l9f2a7"
echo "/navsari/b8k1p4"
echo "/morse/c7x9q1"
echo "/random-day/f2m8z5"
echo "/calendar/k9r4w2"
echo "/miss-me/p8d4x7"
echo "/homesick/m3z7k1"
echo "/truce/h5v2q9"
echo "/found-one/j8w6n3"
echo "/final-secret/x4r7t2"
echo ""