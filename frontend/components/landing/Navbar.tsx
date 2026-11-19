import Link from "next/link";

const links = [
  { href: "#services", label: "Services" },
  { href: "#packages", label: "Packages" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#voice-demos", label: "Voice demos" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#E8DCD1] bg-white">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="font-serif text-xl font-bold text-[#701512]">
          Studio Name
        </Link>
        <ul className="hidden gap-7 text-sm text-[#74645D] md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-[#701512]">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-[#74645D] hover:text-[#701512]">
            Log in
          </Link>
          <Link
            href="/client/requests/new"
            className="rounded-lg bg-[#701512] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4A2522]"
          >
            Request a quote
          </Link>
        </div>
      </nav>
    </header>
  );
}
