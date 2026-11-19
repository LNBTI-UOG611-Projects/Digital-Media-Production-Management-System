"use client";

import { useRef, useState } from "react";

type Demo = { id: number; name: string; meta: string; src: string };

// Placeholder data. Later replace with: GET /api/public/voice-demos/
const demos: Demo[] = [
  { id: 1, name: "Warm narrator", meta: "English, male", src: "" },
  { id: 2, name: "Bright commercial", meta: "English, female", src: "" },
  { id: 3, name: "Calm documentary", meta: "Sinhala, male", src: "" },
  { id: 4, name: "Energetic promo", meta: "Tamil, female", src: "" },
];

function DemoCard({ demo }: { demo: Demo }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const el = audio.current;
    if (!el || !demo.src) return; // no audio file yet
    if (playing) el.pause();
    else el.play();
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#E8DCD1] bg-white p-4">
      <button
        onClick={toggle}
        aria-label={playing ? `Pause ${demo.name}` : `Play ${demo.name}`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#701512] text-white hover:bg-[#4A2522]"
      >
        {playing ? "❚❚" : "▶"}
      </button>
      <div>
        <p className="font-semibold text-[#171313]">{demo.name}</p>
        <p className="text-sm text-[#74645D]">{demo.meta}</p>
      </div>
      <audio
        ref={audio}
        src={demo.src || undefined}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}

export default function VoiceDemos() {
  return (
    <section id="voice-demos" className="py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-serif text-3xl font-bold text-[#701512]">Voice demos</h2>
        <p className="mt-2 max-w-lg text-[#74645D]">Listen to our talent, then request the voices you like.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {demos.map((d) => (
            <DemoCard key={d.id} demo={d} />
          ))}
        </div>
      </div>
    </section>
  );
}
