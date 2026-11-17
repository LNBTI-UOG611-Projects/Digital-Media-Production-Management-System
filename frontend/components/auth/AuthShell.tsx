import Image from "next/image";
import type { ReactNode } from "react";

function Waves() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="bgRed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a1914" />
          <stop offset="0.45" stopColor="#4a0d0b" />
          <stop offset="1" stopColor="#1f0807" />
        </linearGradient>
        <linearGradient id="ribbon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a31d17" />
          <stop offset="1" stopColor="#701512" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#bgRed)" />
      <path d="M0 0H430C330 90 150 130 0 290Z" fill="#a31d17" opacity="0.55" />
      <path d="M0 0H330C250 70 110 110 0 210Z" fill="#2a0806" opacity="0.6" />
      <path d="M0 700C330 700 600 830 930 900H0Z" fill="url(#ribbon)" />
      <path d="M0 735C320 745 590 850 880 900H0Z" fill="#fff8f0" />
      <path d="M1600 0V900H880C1010 790 1230 760 1300 520C1350 340 1420 80 1600 0Z" fill="#fff8f0" />
    </svg>
  );
}

/** Shared layout for the login, register and password pages: waves, brand panel and the card. */
export default function AuthShell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-wine">
      <Waves />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1400px] items-center gap-6 px-6 py-8 lg:grid-cols-[1fr_minmax(0,36rem)] lg:gap-16 lg:px-12">
        <section className="flex flex-col items-center text-center">
          <Image
            src="/lova-mark.png"
            alt=""
            width={150}
            height={181}
            priority
            className="h-24 w-auto drop-shadow-[0_0_22px_rgba(255,120,100,0.65)] lg:h-44"
          />
          <Image src="/lova-name.png" alt="Lova Marketing" width={560} height={42} priority className="mt-5 h-auto w-64 lg:mt-7 lg:w-[34rem]" />
          <div className="mt-3 flex w-64 items-center gap-3 lg:w-[34rem]">
            <span aria-hidden="true" className="h-px flex-1 bg-ivory/40" />
            <Image src="/lova-agency.png" alt="Digital Agency" width={300} height={22} className="h-auto w-36 lg:w-72" />
            <span aria-hidden="true" className="h-px flex-1 bg-ivory/40" />
          </div>
          <p className="mt-10 hidden font-display text-4xl italic text-ivory lg:block">
            Plan. Shoot. <span className="font-bold text-peach">Deliver.</span>
          </p>
          <svg aria-hidden="true" viewBox="0 0 400 24" className="mt-1 hidden h-6 w-80 lg:block">
            <defs>
              <linearGradient id="swoosh" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#f2c38f" stopOpacity="0" />
                <stop offset="0.6" stopColor="#f2c38f" />
                <stop offset="1" stopColor="#c58a4a" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 20C110 4 260 2 400 8" fill="none" stroke="url(#swoosh)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </section>

        <section className={`relative mx-auto w-full ${wide ? "max-w-xl" : "max-w-lg"}`}>
          <svg aria-hidden="true" viewBox="0 0 60 60" className="absolute -right-3 -top-8 hidden h-14 w-14 text-burgundy sm:block">
            <g stroke="currentColor" strokeWidth="4" strokeLinecap="round">
              <path d="M8 24L20 30" />
              <path d="M18 10L28 20" />
              <path d="M34 4L36 18" />
            </g>
          </svg>
          <div className="rounded-[28px] border border-white/60 bg-ivory p-7 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-9">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
