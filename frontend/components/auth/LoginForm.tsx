"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { MOCK_AUTH, MOCK_PASSWORD, ROLE_HOME, login, saveSession } from "@/lib/auth";

const inputClass =
  "w-full rounded-2xl border border-line bg-white py-3.5 pl-12 pr-12 text-charcoal shadow-inner placeholder:text-muted focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-peach";

const iconClass = "pointer-events-none absolute inset-y-0 left-4 flex items-center text-burgundy";

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setLoading(true);
    try {
      const session = await login(username, password);
      saveSession(session, remember);
      router.push(ROLE_HOME[session.role]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {error && (
        <div role="alert" className="rounded-xl border border-burgundy/30 bg-peach/30 px-3 py-2 text-sm text-burgundy">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="username" className="sr-only">Username or email</label>
        <div className="relative">
          <span className={iconClass}>
            <Svg><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></Svg>
          </span>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username or Email"
            aria-invalid={!!error}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="sr-only">Password</label>
        <div className="relative">
          <span className={iconClass}>
            <Svg><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>
          </span>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            aria-invalid={!!error}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted hover:text-burgundy focus:outline-none focus-visible:text-burgundy"
          >
            <Svg>
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
              {!showPassword && <path d="M4 4l16 16" />}
            </Svg>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-charcoal">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-burgundy" />
          Keep me signed in
        </label>
        <Link href="/forgot-password" className="font-medium text-burgundy underline-offset-2 hover:underline">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-burgundy to-wine px-6 py-3.5 text-lg font-semibold text-white shadow-lg shadow-burgundy/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign In"}
        {!loading && (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {MOCK_AUTH && (
        <p className="rounded-xl bg-ivory px-3 py-2 text-xs text-muted">
          Demo mode: sign in as nimal, dilani, kasun, ruwan or hasini with the password {MOCK_PASSWORD}.
        </p>
      )}
    </form>
  );
}
