import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Create account | Lova Marketing" };

export default function RegisterPage() {
  return (
    <AuthShell wide>
      <h1 className="text-4xl font-extrabold tracking-tight text-charcoal sm:text-5xl">
        Create your <span className="text-burgundy">account</span>
      </h1>
      <p className="mt-2 text-lg text-charcoal/80">Request quotes, track projects and review your work.</p>
      <div aria-hidden="true" className="mb-6 mt-3 h-1 w-24 rounded-full bg-burgundy" />

      <RegisterForm />

      <div className="my-5 flex items-center gap-3 text-sm text-muted">
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
        or
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </div>
      <p className="text-center text-charcoal">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-burgundy underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
      <p className="mt-3 text-center text-sm text-muted">
        A photographer or videographer?{" "}
        <Link href="/freelancer/register" className="font-semibold text-burgundy underline-offset-2 hover:underline">
          Apply to join our crew
        </Link>
      </p>
    </AuthShell>
  );
}
