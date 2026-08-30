import { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Trash2, Inbox } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { CATEGORY_COLORS } from '../data/instructions';
import StatCard from '../components/StatCard';

const FORMAT_COLORS = { R: '#FFB000', I: '#C084FC', S: '#60A5FA', B: '#F87171', J: '#34D399' };

export default function Analytics() {
  const { history, clearHistory } = useAppContext();

  const total = history.length;
  const valid = history.filter((h) => h.success).length;
  const invalid = total - valid;
  const rate = total ? Math.round((valid / total) * 100) : 0;

  const categoryData = useMemo(() => {
    const counts = {};
    history.filter((h) => h.success).forEach((h) => {
      const cat = h.result.category;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [history]);

  const formatData = useMemo(() => {
    const counts = {};
    history.filter((h) => h.success).forEach((h) => {
      const fmt = h.result.format.id;
      counts[fmt] = (counts[fmt] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name: `${name}-Type`, value, id: name }));
  }, [history]);

  const validityData = [
    { name: 'Valid', value: valid },
    { name: 'Invalid', value: invalid },
  ];

  const mostFrequent = useMemo(() => {
    const counts = {};
    history.filter((h) => h.success).forEach((h) => {
      const m = h.result.definition.mnemonic;
      counts[m] = (counts[m] || 0) + 1;
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return entries[0] ? `${entries[0][0]} (${entries[0][1]}×)` : '—';
  }, [history]);

  if (total === 0) {
    return (
      <div className="panel p-12 flex flex-col items-center justify-center text-center gap-3 fade-in-up">
        <Inbox size={40} className="text-[var(--color-muted)]" />
        <h2 className="font-mono-display font-bold text-lg">No Activity Yet</h2>
        <p className="text-sm text-[var(--color-muted)] max-w-sm">
          Analytics are generated from real decoding activity. Head to the Simulator and decode a few instructions to
          see charts here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 fade-in-up">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Decoded" value={total} accent="amber" />
        <StatCard label="Successful" value={valid} accent="phosphor" />
        <StatCard label="Failed" value={invalid} accent="red" />
        <StatCard label="Success Rate" value={`${rate}%`} accent="blue" />
        <StatCard label="Most Frequent" value={mostFrequent} accent="purple" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ChartPanel title="Valid vs Invalid">
          <PieChart width={260} height={220}>
            <Pie data={validityData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
              <Cell fill="var(--color-phosphor)" />
              <Cell fill="var(--color-red)" />
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ChartPanel>

        <ChartPanel title="Instruction Categories">
          <PieChart width={260} height={220}>
            <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
              {categoryData.map((d, i) => (
                <Cell key={i} fill={CATEGORY_COLORS[d.name] || '#7C8B87'} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ChartPanel>

        <ChartPanel title="Format Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={formatData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
              <XAxis dataKey="name" tick={{ fill: '#7C8B87', fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: '#7C8B87', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {formatData.map((d, i) => (
                  <Cell key={i} fill={FORMAT_COLORS[d.id] || '#7C8B87'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      {/* Activity log */}
      <div className="panel p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs uppercase tracking-wider text-[var(--color-muted)]">Decoding Activity (this session)</h3>
          <button onClick={clearHistory} className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-red)]">
            <Trash2 size={13} /> Clear
          </button>
        </div>
        <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto">
          {history.map((h) => (
            <div key={h.id} className="flex items-center justify-between text-xs bg-[var(--color-panel-2)] border border-[var(--color-line)] rounded-lg px-3 py-2">
              <span className="font-mono-display">{h.input}</span>
              <span className={h.success ? 'text-[var(--color-phosphor)]' : 'text-[var(--color-red)]'}>
                {h.success ? h.result.assembly : h.error.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: '#141C18',
  border: '1px solid #223028',
  borderRadius: 8,
  fontSize: 12,
  color: '#E7ECEA',
};

function ChartPanel({ title, children }) {
  return (
    <div className="panel p-5 flex flex-col items-center">
      <h3 className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-3 self-start">{title}</h3>
      {children}
    </div>
  );
}
