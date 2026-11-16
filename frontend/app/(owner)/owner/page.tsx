import { Button } from "@/components/ui/Button";
import BarList from "@/components/owner/BarList";
import Card from "@/components/owner/Card";
import KpiCard from "@/components/owner/KpiCard";
import { formatLkr } from "@/components/owner/format";
import {
  STAGE_LABELS,
  STAGE_ORDER,
  alerts,
  approvals,
  invoices,
  ownerUser,
  projects,
  revenueThisMonth,
  todaysSchedule,
} from "@/lib/mock/owner";

export default function OwnerDashboardPage() {
  const activeProjects = projects.filter((p) => p.stage === "confirmed" || p.stage === "in_production" || p.stage === "post_production");
  const unpaid = invoices.filter((i) => i.status === "sent" || i.status === "overdue");
  const unpaidTotal = unpaid.reduce((sum, i) => sum + i.amount, 0);

  const pipeline = STAGE_ORDER.map((stage) => {
    const count = projects.filter((p) => p.stage === stage).length;
    return { label: STAGE_LABELS[stage], value: count, display: `${count}` };
  });

  const profit = projects
    .filter((p) => p.cost > 0)
    .map((p) => ({ label: p.name, value: p.revenue - p.cost, display: formatLkr(p.revenue - p.cost) }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-burgundy">Good morning, {ownerUser.name}</h1>
          <p className="text-muted">Here is where the studio stands today.</p>
        </div>
        <Button>New quotation</Button>
      </div>

      <section aria-label="Key numbers" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Revenue this month" value={formatLkr(revenueThisMonth)} note="Across 6 invoiced projects" />
        <KpiCard label="Active projects" value={`${activeProjects.length}`} note="Confirmed, shooting or editing" />
        <KpiCard label="Pending approvals" value={`${approvals.length}`} note="Waiting for your decision" />
        <KpiCard label="Unpaid invoices" value={formatLkr(unpaidTotal)} note={`${unpaid.length} invoices open`} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Pipeline by stage" className="lg:col-span-2">
          <BarList items={pipeline} />
        </Card>

        <Card title="Alerts">
          <ul className="space-y-3">
            {alerts.map((a) => (
              <li
                key={a.id}
                className={`rounded-md border border-line border-l-4 bg-ivory p-3 text-sm ${
                  a.severity === "high" ? "border-l-burgundy" : "border-l-gold"
                }`}
              >
                <span className="font-semibold">{a.severity === "high" ? "Urgent: " : "Heads up: "}</span>
                {a.message}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Needs your approval">
          <ul className="divide-y divide-line">
            {approvals.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-sm text-muted">{a.detail}</p>
                  <p className="text-sm">{formatLkr(a.amount)}</p>
                </div>
                <Button>Review</Button>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Today's schedule">
          <ul className="space-y-3">
            {todaysSchedule.map((s) => (
              <li key={s.id} className="flex gap-4">
                <span className="w-14 shrink-0 rounded-md bg-peach px-2 py-1 text-center text-sm font-semibold text-charcoal">
                  {s.start_time}
                </span>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-sm text-muted">
                    {s.location}, {s.crew_count} crew
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Profit by project">
        <BarList items={profit} />
      </Card>
    </div>
  );
}
