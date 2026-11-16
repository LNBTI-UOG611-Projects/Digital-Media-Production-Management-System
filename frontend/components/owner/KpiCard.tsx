interface KpiCardProps {
  label: string;
  value: string;
  note: string;
}

export default function KpiCard({ label, value, note }: KpiCardProps) {
  return (
    <div className="rounded-lg border border-line border-t-4 border-t-gold bg-white p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl text-charcoal">{value}</p>
      <p className="mt-1 text-sm text-muted">{note}</p>
    </div>
  );
}
