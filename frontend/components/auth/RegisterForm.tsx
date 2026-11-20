"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { RegisterError, registerClient, type RegisterInput } from "@/lib/auth";

type Values = RegisterInput & { confirm: string; agree: boolean };
type Errors = Partial<Record<keyof Values, string>>;

const empty: Values = {
  client_type: "individual", first_name: "", last_name: "", company_name: "", email: "", phone: "",
  username: "", password: "", confirm: "", agree: false,
};

const inputClass =
  "w-full rounded-2xl border bg-white px-4 py-3 text-charcoal shadow-inner placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-peach";

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.first_name.trim()) e.first_name = "Enter your first name.";
  if (!v.last_name.trim()) e.last_name = "Enter your last name.";
  if (v.client_type === "company" && !v.company_name.trim()) e.company_name = "Enter your company or business name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Enter a valid email address.";
  if (v.phone && !/^[0-9+()\-\s]{7,20}$/.test(v.phone)) e.phone = "Enter a valid phone number.";
  if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(v.username)) e.username = "Use 3 to 30 letters, numbers, dots, dashes or underscores.";
  if (v.password.length < 8 || !/[a-zA-Z]/.test(v.password) || !/[0-9]/.test(v.password))
    e.password = "Use at least 8 characters with a letter and a number.";
  if (v.confirm !== v.password) e.confirm = "Passwords do not match.";
  if (!v.agree) e.agree = "Please accept the terms to continue.";
  return e;
}

function strength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^a-zA-Z0-9]/.test(p)) s++;
  return s;
}
const strengthLabel = ["Too short", "Weak", "Fair", "Good", "Strong"];

function Field({
  id, label, error, children, hint,
}: { id: string; label: string; error?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-charcoal">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1 text-sm text-burgundy">{error}</p>}
    </div>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = <K extends keyof Values>(k: K, val: Values[K]) => setV((p) => ({ ...p, [k]: val }));
  const cls = (k: keyof Values) => `${inputClass} ${errors[k] ? "border-burgundy" : "border-line focus:border-burgundy"}`;
  const aria = (k: keyof Values) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-error` : undefined });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    const found = validate(v);
    setErrors(found);
    if (Object.keys(found).length) return;
    setLoading(true);
    try {
      const { confirm: _c, agree: _a, ...payload } = v;
      void _c; void _a;
      await registerClient({ ...payload, company_name: v.client_type === "company" ? v.company_name.trim() : "" });
      setDone(true);
    } catch (err) {
      if (err instanceof RegisterError && Object.keys(err.fields).length) setErrors(err.fields as Errors);
      else setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="py-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-peach/40 text-burgundy">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-charcoal">Account created</h2>
        <p className="mt-2 text-muted">Welcome to Lova Marketing, {v.first_name}. You can sign in now.</p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-6 rounded-full bg-gradient-to-r from-burgundy to-wine px-8 py-3 font-semibold text-white shadow-lg shadow-burgundy/30 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach focus-visible:ring-offset-2"
        >
          Go to sign in
        </button>
      </div>
    );
  }

  const score = strength(v.password);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && (
        <div role="alert" className="rounded-xl border border-burgundy/30 bg-peach/30 px-3 py-2 text-sm text-burgundy">{formError}</div>
      )}

      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold text-charcoal">I am registering as</legend>
        <div className="grid grid-cols-2 gap-3">
          {([
            { value: "individual", title: "Individual", note: "Personal or private" },
            { value: "company", title: "Company", note: "Business or organisation" },
          ] as const).map((o) => (
            <label
              key={o.value}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 focus-within:ring-2 focus-within:ring-peach ${
                v.client_type === o.value ? "border-burgundy bg-peach/30" : "border-line bg-white"
              }`}
            >
              <input type="radio" name="client_type" value={o.value} checked={v.client_type === o.value} onChange={() => set("client_type", o.value)} className="h-4 w-4 accent-burgundy" />
              <span>
                <span className="block text-sm font-semibold text-charcoal">{o.title}</span>
                <span className="block text-xs text-muted">{o.note}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="first_name" label="First name" error={errors.first_name}>
          <input id="first_name" autoComplete="given-name" value={v.first_name} onChange={(e) => set("first_name", e.target.value)} className={cls("first_name")} {...aria("first_name")} />
        </Field>
        <Field id="last_name" label="Last name" error={errors.last_name}>
          <input id="last_name" autoComplete="family-name" value={v.last_name} onChange={(e) => set("last_name", e.target.value)} className={cls("last_name")} {...aria("last_name")} />
        </Field>
      </div>

      {v.client_type === "company" && (
        <Field id="company_name" label="Company or business name" error={errors.company_name}>
          <input id="company_name" autoComplete="organization" value={v.company_name} onChange={(e) => set("company_name", e.target.value)} className={cls("company_name")} {...aria("company_name")} />
        </Field>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="email" label="Email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" className={cls("email")} {...aria("email")} />
        </Field>
        <Field id="phone" label="Phone (optional)" error={errors.phone}>
          <input id="phone" type="tel" autoComplete="tel" value={v.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+94 77 123 4567" className={cls("phone")} {...aria("phone")} />
        </Field>
      </div>

      <Field id="username" label="Username" error={errors.username} hint="You will use this to sign in.">
        <input id="username" autoComplete="username" value={v.username} onChange={(e) => set("username", e.target.value)} className={cls("username")} {...aria("username")} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="password" label="Password" error={errors.password}>
          <div className="relative">
            <input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={v.password} onChange={(e) => set("password", e.target.value)} className={`${cls("password")} pr-12`} {...aria("password")} />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide passwords" : "Show passwords"}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted hover:text-burgundy focus:outline-none focus-visible:text-burgundy"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />{!showPassword && <path d="M4 4l16 16" />}
              </svg>
            </button>
          </div>
        </Field>
        <Field id="confirm" label="Confirm password" error={errors.confirm}>
          <input id="confirm" type={showPassword ? "text" : "password"} autoComplete="new-password" value={v.confirm} onChange={(e) => set("confirm", e.target.value)} className={cls("confirm")} {...aria("confirm")} />
        </Field>
      </div>

      {v.password && (
        <div aria-live="polite">
          <div className="flex gap-1.5" aria-hidden="true">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= score ? (score >= 3 ? "bg-burgundy" : "bg-gold") : "bg-line"}`} />
            ))}
          </div>
          <p className="mt-1 text-xs text-muted">Password strength: {strengthLabel[score]}</p>
        </div>
      )}

      <div>
        <label className="flex items-start gap-2 text-sm text-charcoal">
          <input type="checkbox" checked={v.agree} onChange={(e) => set("agree", e.target.checked)} className="mt-0.5 h-4 w-4 accent-burgundy" aria-invalid={!!errors.agree} />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="font-medium text-burgundy underline-offset-2 hover:underline">terms of service</Link>{" "}
            and the{" "}
            <Link href="/privacy" className="font-medium text-burgundy underline-offset-2 hover:underline">privacy policy</Link>.
          </span>
        </label>
        {errors.agree && <p className="mt-1 text-sm text-burgundy">{errors.agree}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-burgundy to-wine px-6 py-3.5 text-lg font-semibold text-white shadow-lg shadow-burgundy/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
