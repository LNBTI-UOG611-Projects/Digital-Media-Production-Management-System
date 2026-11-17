import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in | Lova Marketing" };

export default function LoginPage() {
  return (
    <AuthShell>
      <h1 className="text-4xl font-extrabold tracking-tight text-charcoal sm:text-5xl">
        Welcome <span className="text-burgundy">Back</span>
      </h1>
      <p className="mt-2 text-lg text-charcoal/80">Sign in to manage your projects.</p>
      <div aria-hidden="true" className="mb-7 mt-3 h-1 w-24 rounded-full bg-burgundy" />

      <LoginForm />

      <div className="my-5 flex items-center gap-3 text-sm text-muted">
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
        or
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </div>
      <p className="text-center text-charcoal">
        New client?{" "}
        <Link href="/register" className="font-bold text-burgundy underline-offset-2 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
