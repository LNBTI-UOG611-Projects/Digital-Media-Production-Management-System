interface CardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, action, className = "" }: CardProps) {
  return (
    <section className={`rounded-lg border border-line bg-white p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl text-burgundy">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
