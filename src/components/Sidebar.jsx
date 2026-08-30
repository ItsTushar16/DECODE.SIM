import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  ListOrdered,
  Grid3x3,
  Search,
  Radio,
  FlaskConical,
  BarChart3,
  Info,
  BinaryIcon,
} from 'lucide-react';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/simulator', label: 'Simulator', icon: Cpu },
  { to: '/step-by-step', label: 'Step-by-Step Decode', icon: ListOrdered },
  { to: '/formats', label: 'Instruction Formats', icon: Grid3x3 },
  { to: '/opcodes', label: 'Opcode Explorer', icon: Search },
  { to: '/control-signals', label: 'Control Signals', icon: Radio },
  { to: '/tests', label: 'Test Cases', icon: FlaskConical },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/about', label: 'About Project', icon: Info },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 shrink-0 bg-[var(--color-panel)] border-r border-[var(--color-line)] z-40 transform transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 px-5 h-16 border-b border-[var(--color-line)]">
          <div className="w-8 h-8 rounded-md bg-[var(--color-phosphor-dim)] flex items-center justify-center glow-phosphor">
            <BinaryIcon size={18} className="text-[var(--color-phosphor)]" />
          </div>
          <div>
            <p className="font-mono-display text-sm font-bold tracking-tight text-[var(--color-text)] leading-none">
              DECODE<span className="text-[var(--color-amber)]">.SIM</span>
            </p>
            <p className="text-[10px] text-[var(--color-muted)] mt-0.5">Instruction Decoder v1.0</p>
          </div>
        </div>

        <nav className="p-3 flex flex-col gap-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group ${
                  isActive
                    ? 'bg-[var(--color-panel-2)] text-[var(--color-amber)] border border-[var(--color-amber-dim)]'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-panel-2)] border border-transparent'
                }`
              }
            >
              <Icon size={17} strokeWidth={2} />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}

          <div className="mt-auto pt-4 px-3">
            <div className="trace-divider mb-3" />
            <p className="text-[10px] text-[var(--color-muted)] leading-relaxed">
              Instruction Decoding Algorithms
            </p>
          </div>
        </nav>
      </aside>
    </>
  );
}
