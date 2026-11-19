const services = [
  { title: "Video production", text: "Commercials, corporate films, events and social content, shot and edited." },
  { title: "Voice-over and dubbing", text: "Browse talent by role and language and choose your preferred voices." },
  { title: "Audio and post", text: "Sound design, mixing and mastering for video, radio and podcasts." },
  { title: "Editing and motion", text: "Colour, titles and animation with clear proofing rounds." },
];

const steps = [
  { title: "Submit your brief", text: "Describe the project and pick preferred talent." },
  { title: "Review the quotation", text: "Accept or reject it online." },
  { title: "Track and proof", text: "Follow progress, comment and request revisions." },
  { title: "Pay and receive", text: "Settle the invoice, then get your final files." },
];

export default function Services() {
  return (
    <>
      <section id="services" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-serif text-3xl font-bold text-[#701512]">Services</h2>
          <p className="mt-2 max-w-lg text-[#74645D]">Everything a production needs, handled by one team.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.title} className="rounded-xl border border-[#E8DCD1] bg-white p-6 hover:border-[#C58A4A]">
                <h3 className="font-semibold text-[#171313]">{s.title}</h3>
                <p className="mt-2 text-sm text-[#74645D]">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-serif text-3xl font-bold text-[#701512]">How it works</h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-xl border border-[#E8DCD1] bg-white p-6">
                <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#F2C38F] text-sm font-bold text-[#171313]">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-[#171313]">{s.title}</h3>
                <p className="mt-1 text-sm text-[#74645D]">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
