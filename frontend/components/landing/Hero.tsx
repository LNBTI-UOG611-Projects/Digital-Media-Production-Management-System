import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#701512] to-[#4A2522] py-24 text-[#FFF8F0]">
      <div className="mx-auto max-w-6xl px-5">
        <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight md:text-6xl">
          Video, audio and voice work, managed from brief to delivery.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-[#FFF8F0]/85">
          Send your brief, approve a quotation, follow progress, review proofs and pay online.
          Every step happens in one place.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/client/requests/new"
            className="rounded-lg bg-[#F2C38F] px-6 py-3 font-semibold text-[#171313] hover:bg-[#C58A4A]"
          >
            Start a request
          </Link>
          <a
            href="#portfolio"
            className="rounded-lg border border-[#F2C38F] px-6 py-3 font-semibold text-[#F2C38F] hover:bg-[#4A2522]"
          >
            View our work
          </a>
        </div>
      </div>
    </section>
  );
}
