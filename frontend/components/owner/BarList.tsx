// Simple horizontal bars made with Tailwind only (no chart library).

export interface BarItem {
  label: string;
  value: number;
  display: string;
}

export default function BarList({ items }: { items: BarItem[] }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex justify-between gap-3 text-sm">
            <span>{item.label}</span>
            <span className="font-semibold">{item.display}</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full border border-line bg-ivory" role="presentation">
            <div className="h-full rounded-full bg-burgundy" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
