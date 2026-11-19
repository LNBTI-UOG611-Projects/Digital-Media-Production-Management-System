import Link from "next/link";

// Placeholder data. Later replace with: GET /api/public/packages/
const packages = [
  { name: "Essential", price: "From $0", popular: false, items: ["Single deliverable", "1 revision round", "Standard turnaround"] },
  { name: "Professional", price: "From $0", popular: true, items: ["Multiple deliverables", "3 revision rounds", "Voice talent included"] },
  { name: "Premium", price: "From $0", popular: false, items: ["Full campaign production", "Unlimited proofing", "Priority support"] },
];

export default function Packages() {
  return (
    <section id="packages" className="bg-[#F2C38F]/25 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-serif text-3xl font-bold text-[#701512]">Packages</h2>
        <p className="mt-2 max-w-lg text-[#74645D]">Pick a starting point and add extras to fit your project.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {packages.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-xl bg-white p-6 ${p.popular ? "border-2 border-[#C58A4A]" : "border border-[#E8DCD1]"}`}
            >
              {p.popular && (
                <span className="absolute -top-3 right-4 rounded-full bg-[#C58A4A] px-3 py-0.5 text-xs font-semibold text-[#171313]">
                  Most popular
                </span>
              )}
              <h3 className="font-semibold text-[#171313]">{p.name}</h3>
              <p className="my-2 font-serif text-3xl font-bold text-[#701512]">{p.price}</p>
              <ul className="mb-5 space-y-1 text-sm text-[#74645D]">
                {p.items.map((i) => (
                  <li key={i}>✓ {i}</li>
                ))}
              </ul>
              <Link
                href="/client/requests/new"
                className="inline-block rounded-lg bg-[#701512] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4A2522]"
              >
                Choose {p.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
