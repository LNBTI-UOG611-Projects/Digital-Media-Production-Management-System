import Card from "@/components/freelancer/Card";
import InvitationCard from "@/components/freelancer/InvitationCard";
import OpenRoles from "@/components/freelancer/OpenRoles";
import ProfileBadges from "@/components/freelancer/ProfileBadges";
import { formatLkr } from "@/components/freelancer/format";
import {
  assignments,
  availability,
  earningsSummary,
  freelancerUser,
  invitation,
  monthlyEarnings,
  openRoles,
  profile,
  ratingBreakdown,
} from "@/lib/mock/freelancer";

const STATUS_LABEL = {
  confirmed: "Confirmed",
  awaiting_call_sheet: "Call sheet coming",
  completed: "Completed",
} as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Colombo" });
}

export default function FreelancerDashboardPage() {
  const maxEarning = Math.max(...monthlyEarnings.map((m) => m.amount));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-burgundy">Welcome back, {freelancerUser.name}</h1>
        <div className="mt-3">
          <ProfileBadges profile={profile} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <InvitationCard invitation={invitation} />
        <OpenRoles roles={openRoles} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="My assignments">
          <ul className="divide-y divide-line">
            {assignments.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="font-semibold">{a.project_title}</p>
                  <p className="text-sm text-muted">
                    {a.role_title}, {formatDate(a.shoot_date)}, {a.location}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    a.status === "completed" ? "border border-line bg-white text-muted" : "bg-peach font-semibold text-charcoal"
                  }`}
                >
                  {STATUS_LABEL[a.status]}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Earnings">
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <dt className="text-muted">This month</dt>
              <dd className="font-display text-lg">{formatLkr(earningsSummary.this_month)}</dd>
            </div>
            <div>
              <dt className="text-muted">Pending payout</dt>
              <dd className="font-display text-lg">{formatLkr(earningsSummary.pending_payout)}</dd>
            </div>
            <div>
              <dt className="text-muted">Paid this year</dt>
              <dd className="font-display text-lg">{formatLkr(earningsSummary.paid_this_year)}</dd>
            </div>
          </dl>
          <ul className="mt-5 flex h-32 items-end gap-3" aria-label="Earnings over the last six months">
            {monthlyEarnings.map((m) => (
              <li key={m.month} className="flex h-full flex-1 flex-col justify-end text-center text-xs text-muted">
                <div
                  className="w-full rounded-t-md bg-burgundy"
                  style={{ height: `${(m.amount / maxEarning) * 100}%` }}
                  title={formatLkr(m.amount)}
                />
                <span className="mt-1">{m.month}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="My rating">
          <p className="font-display text-4xl text-charcoal">
            {profile.rating.toFixed(1)} <span className="text-base text-muted">out of 5 from {profile.rating_count} jobs</span>
          </p>
          <ul className="mt-4 space-y-3">
            {ratingBreakdown.map((r) => (
              <li key={r.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{r.label}</span>
                  <span className="font-semibold">{r.score.toFixed(1)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full border border-line bg-ivory" role="presentation">
                  <div className="h-full rounded-full bg-burgundy" style={{ width: `${(r.score / 5) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Availability this week">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {availability.map((d) => (
              <li
                key={d.date}
                className={`rounded-md border px-3 py-2 text-sm ${
                  d.available ? "border-burgundy bg-peach text-charcoal" : "border-line bg-white text-muted"
                }`}
              >
                <p className="font-semibold">{d.label}</p>
                <p>{d.available ? "Available" : "Booked"}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
