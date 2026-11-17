import type { FreelancerProfile } from "@/lib/mock/freelancer";

const TIER_LABEL = { bronze: "Bronze tier", silver: "Silver tier", gold: "Gold tier" } as const;

export default function ProfileBadges({ profile }: { profile: FreelancerProfile }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tier and skills">
      <li className="rounded-full bg-burgundy px-3 py-1 text-sm font-semibold text-ivory">{TIER_LABEL[profile.tier]}</li>
      {profile.skills.map((s) => (
        <li
          key={s.name}
          className={`rounded-full border px-3 py-1 text-sm ${
            s.verified ? "border-burgundy bg-peach text-charcoal" : "border-line bg-white text-muted"
          }`}
        >
          {s.name}
          <span className="font-semibold">{s.verified ? " (verified)" : " (not verified)"}</span>
        </li>
      ))}
    </ul>
  );
}
