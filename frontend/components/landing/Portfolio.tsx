// Placeholder data. Later replace with: GET /api/public/portfolio/
const items = [
  { title: "Brand film", type: "Corporate" },
  { title: "Product launch", type: "Commercial" },
  { title: "Documentary short", type: "Storytelling" },
  { title: "Event highlights", type: "Live event" },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="bg-[#171313] py-20 text-[#FFF8F0]">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-serif text-3xl font-bold text-[#F2C38F]">Portfolio</h2>
        <p className="mt-2 max-w-lg text-[#FFF8F0]/70">A selection of recent projects.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <div
              key={i.title}
              className="flex aspect-[4/3] items-end rounded-xl border border-[#4A2522] bg-gradient-to-br from-[#4A2522] to-[#701512] p-4"
            >
              <div>
                <p className="font-semibold">{i.title}</p>
                <p className="text-sm text-[#F2C38F]">{i.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
