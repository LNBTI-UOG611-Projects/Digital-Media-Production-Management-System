import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in | Lova Marketing" };

const stripes = (a: string, b: string) =>
  `repeating-linear-gradient(135deg, ${a} 0 14px, ${b} 14px 28px)`;

const spotlights =
  "radial-gradient(60rem 32rem at 50% -8%, rgb(112 21 18 / 0.9), transparent 70%), radial-gradient(44rem 26rem at 85% 108%, rgb(74 37 34 / 0.9), transparent 70%)";

const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E\")";

const sprockets =
  "repeating-linear-gradient(to bottom, transparent 0 14px, rgb(255 248 240 / 0.14) 14px 34px, transparent 34px 48px)";

function Corner({ className }: { className: string }) {
  return <span aria-hidden="true" className={`absolute h-6 w-6 border-peach/80 ${className}`} />;
}

export default function LoginPage() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-charcoal px-4 py-8"
      style={{ backgroundImage: spotlights }}
    >
      {/* film grain */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: grain }} />

      {/* film strip edges */}
      <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-16 border-r border-ivory/10 bg-black/40 md:block">
        <div className="absolute inset-y-0 left-5 w-6" style={{ backgroundImage: sprockets }} />
      </div>
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-16 border-l border-ivory/10 bg-black/40 md:block">
        <div className="absolute inset-y-0 left-5 w-6" style={{ backgroundImage: sprockets }} />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        {/* brand */}
        <Image
          src="/lova-mark.png"
          alt=""
          width={64}
          height={64}
          priority
          className="rounded-2xl ring-2 ring-gold/70"
        />
        <Image
          src="/lova-wordmark.png"
          alt="Lova Marketing Digital Agency"
          width={280}
          height={37}
          priority
          className="mt-3 h-auto w-56 sm:w-64"
        />

        {/* clapperboard sign-in card */}
        <div className="relative mt-8 w-full">
          <Corner className="-left-4 -top-6 rounded-tl border-l-2 border-t-2" />
          <Corner className="-right-4 -top-6 rounded-tr border-r-2 border-t-2" />
          <Corner className="-bottom-4 -left-4 rounded-bl border-b-2 border-l-2" />
          <Corner className="-bottom-4 -right-4 rounded-br border-b-2 border-r-2" />

          <div
            aria-hidden="true"
            className="relative z-10 -mb-0.5 h-7 origin-bottom-left rounded-t-md border-2 border-charcoal motion-safe:animate-clap"
            style={{ backgroundImage: stripes("var(--color-charcoal)", "var(--color-ivory)"), transform: "rotate(-3deg)" }}
          />
          <div
            aria-hidden="true"
            className="h-7 border-2 border-charcoal"
            style={{ backgroundImage: stripes("var(--color-ivory)", "var(--color-charcoal)") }}
          />

          <div className="rounded-b-xl border-x border-b border-line bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-5 grid grid-cols-3 border border-line text-center font-slate text-[11px] tracking-widest text-muted">
              <div className="border-r border-line px-1 py-1.5">PROD<span className="block text-charcoal">LOVA DMS</span></div>
              <div className="border-r border-line px-1 py-1.5">ROLL<span className="block text-charcoal">01</span></div>
              <div className="px-1 py-1.5">TAKE<span className="block text-charcoal">1</span></div>
            </div>

            <h1 className="font-display text-3xl text-charcoal">Ready when you are</h1>
            <p className="mt-1 mb-5 text-muted">Sign in to manage your projects.</p>

            <LoginForm />

            <p className="mt-5 border-t border-line pt-4 text-center text-sm text-muted">
              New client?{" "}
              <Link href="/register" className="font-semibold text-burgundy underline-offset-2 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 flex items-center gap-2 text-xs tracking-widest text-ivory/70">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-peach motion-safe:animate-pulse" />
          LOVA MARKETING DIGITAL AGENCY
        </p>
      </div>
    </main>
  );
}
