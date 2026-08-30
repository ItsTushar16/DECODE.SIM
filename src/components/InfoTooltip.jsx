import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function InfoTooltip({ term, children }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="text-[var(--color-muted)] hover:text-[var(--color-amber)] ml-1"
        aria-label={`Learn more about ${term}`}
      >
        <HelpCircle size={13} />
      </button>
      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 panel !bg-[var(--color-panel-2)] p-3 text-xs text-[var(--color-text)] shadow-xl fade-in-up">
          <p className="font-semibold text-[var(--color-amber)] mb-1">{term}</p>
          <p className="text-[var(--color-muted)] leading-relaxed">{children}</p>
        </div>
      )}
    </span>
  );
}
