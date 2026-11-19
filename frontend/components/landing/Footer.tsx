import Link from "next/link";

const quotes = [
  { text: "Clear process, great result, and we always knew where the project stood.", who: "Client name, Company" },
  { text: "Proofing and revisions were painless, and the voice talent was perfect.", who: "Client name, Company" },
  { text: "A professional crew and on-time delivery from start to finish.", who: "Client name, Company" },
];

export default function Footer() {
  return (
    <>
      <section className="bg-[#171313] py-16 text-[#FFF8F0]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q.text}>
              <blockquote className="italic text-[#FFF8F0]/85">“{q.text}”</blockquote>
              <figcaption className="mt-3 text-sm font-semibold text-[#F2C38F]">{q.who}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-[#F2C38F] py-16 text-center text-[#171313]">
        <h2 className="font-serif text-3xl font-bold">Ready to start your project?</h2>
        <p className="mt-2">Create an account, send your brief and get a quotation.</p>
        <Link
          href="/client/requests/new"
          className="mt-5 inline-block rounded-lg bg-[#701512] px-6 py-3 font-semibold text-white hover:bg-[#4A2522]"
        >
          Create a request
        </Link>
      </section>

      <footer className="border-t-4 border-[#C58A4A] bg-[#171313] py-10 text-sm text-[#FFF8F0]/70">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-5">
          <p>
            <span className="font-semibold text-[#F2C38F]">Studio Name</span>
            <br />
            Creative production, from brief to delivery.
          </p>
          <p className="space-x-4">
            <a href="#services" className="hover:text-[#F2C38F]">Services</a>
            <a href="#packages" className="hover:text-[#F2C38F]">Packages</a>
            <a href="#portfolio" className="hover:text-[#F2C38F]">Portfolio</a>
            <a href="#voice-demos" className="hover:text-[#F2C38F]">Voice demos</a>
          </p>
          <p>© 2026 Studio Name</p>
        </div>
      </footer>
    </>
  );
}
