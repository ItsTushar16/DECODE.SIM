import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const TITLES = {
  '/': 'Dashboard',
  '/simulator': 'Instruction Simulator',
  '/step-by-step': 'Step-by-Step Decoding',
  '/formats': 'Instruction Format Explorer',
  '/opcodes': 'Opcode Explorer',
  '/control-signals': 'Control Signal Simulation',
  '/tests': 'Testing Module',
  '/analytics': 'Analytics',
  '/about': 'About Project',
};

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const title = TITLES[location.pathname] || 'Instruction Decoder';

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center gap-3 px-4 lg:px-8 border-b border-[var(--color-line)] bg-[var(--color-bg)]/90 backdrop-blur">
      <button
        className="lg:hidden text-[var(--color-muted)]"
        onClick={onMenuClick}
      >
        <Menu size={22} />
      </button>
      <h1 className="font-mono-display font-semibold text-[var(--color-text)] text-base lg:text-lg tracking-tight">
        {title}
      </h1>
      <div className="ml-auto flex items-center gap-2 text-xs text-[var(--color-muted)]">
        <span className="w-2 h-2 rounded-full bg-[var(--color-phosphor)] pulse-glow" />
        SIMULATOR ACTIVE
      </div>
    </header>
  );
}
