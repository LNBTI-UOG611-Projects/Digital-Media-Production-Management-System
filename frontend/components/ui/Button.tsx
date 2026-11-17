import type { ButtonHTMLAttributes } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-md bg-burgundy px-4 py-2.5 font-semibold text-white transition hover:bg-wine focus:outline-none focus-visible:ring-2 focus-visible:ring-peach focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}
