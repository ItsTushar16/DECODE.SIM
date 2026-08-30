const COLORS = {
  Arithmetic: '#FFB000',
  Logical: '#34D399',
  'Data Transfer': '#60A5FA',
  Immediate: '#C084FC',
  'Control Flow': '#F87171',
  default: '#7C8B87',
};

export default function Badge({ children, category }) {
  const color = COLORS[category] || COLORS.default;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border"
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}15` }}
    >
      {children}
    </span>
  );
}
