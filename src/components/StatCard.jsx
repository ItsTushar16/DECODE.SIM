export default function StatCard({ label, value, sublabel, accent = 'phosphor', icon: Icon }) {
  const colorVar = `var(--color-${accent})`;
  return (
    <div className="panel p-4 lg:p-5 flex flex-col gap-2 fade-in-up">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-[var(--color-muted)]">{label}</span>
        {Icon && <Icon size={16} style={{ color: colorVar }} />}
      </div>
      <span className="font-mono-display text-2xl lg:text-3xl font-bold" style={{ color: colorVar }}>
        {value}
      </span>
      {sublabel && <span className="text-[11px] text-[var(--color-muted)]">{sublabel}</span>}
    </div>
  );
}
