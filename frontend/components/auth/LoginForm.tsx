"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { MOCK_AUTH, MOCK_PASSWORD, ROLE_HOME, login, saveSession } from "@/lib/auth";

const inputClass =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-charcoal placeholder:text-muted/70 focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-peach";

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" />}
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
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error && (
        <div role="alert" className="rounded-md border border-burgundy/30 bg-peach/30 px-3 py-2 text-sm text-burgundy">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-semibold text-charcoal">
          Username or email
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={!!error}
          className={inputClass}
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-semibold text-charcoal">
            Password
          </label>
          <Link href="/forgot-password" className="text-sm text-burgundy underline-offset-2 hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            aria-invalid={!!error}
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted hover:text-burgundy focus:outline-none focus-visible:text-burgundy"
          >
            <EyeIcon off={showPassword} />
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="h-4 w-4 accent-burgundy"
        />
        Keep me signed in
      </label>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Signing in…" : "Sign in"}
      </Button>

      {MOCK_AUTH && (
        <p className="rounded-md bg-ivory px-3 py-2 text-xs text-muted">
          Demo mode: sign in as nimal, dilani, kasun, ruwan or hasini with the password {MOCK_PASSWORD}.
        </p>
      )}
    </form>
  );
}
