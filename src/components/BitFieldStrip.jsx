import { useState } from 'react';

const FIELD_COLORS = {
  opcode: 'var(--color-amber)',
  rd: 'var(--color-phosphor)',
  rs1: 'var(--color-blue)',
  rs2: 'var(--color-purple)',
  funct: 'var(--color-red)',
  imm: 'var(--color-phosphor)',
};

/**
 * Renders a 16-bit instruction word as a segmented, interactive strip.
 * fields: [{ name, bits, start, purpose }]
 * binary: full 16-char binary string
 */
export default function BitFieldStrip({ fields, binary, onSelectField, compact = false }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="w-full">
      <div className="flex w-full rounded-lg overflow-hidden border border-[var(--color-line)] font-mono-display select-none">
        {fields.map((f) => {
          const value = binary ? binary.substring(f.start, f.start + f.bits) : null;
          const color = FIELD_COLORS[f.name] || 'var(--color-muted)';
          const widthPct = (f.bits / 16) * 100;
          const isHovered = hovered === f.name;
          return (
            <button
              key={f.name}
              style={{
                width: `${widthPct}%`,
                borderColor: color,
                backgroundColor: isHovered ? `${color}22` : 'var(--color-panel-2)',
              }}
              className={`relative border-r last:border-r-0 border-[var(--color-line)] py-2 px-1 flex flex-col items-center transition-colors ${compact ? 'py-1.5' : 'py-3'}`}
              onMouseEnter={() => setHovered(f.name)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelectField && onSelectField(f)}
            >
              <span
                className="text-[9px] uppercase tracking-wider mb-1"
                style={{ color }}
              >
                {f.name}
              </span>
              <span className={`font-bold ${compact ? 'text-xs' : 'text-sm lg:text-base'}`} style={{ color: value ? 'var(--color-text)' : 'var(--color-muted)' }}>
                {value || '·'.repeat(f.bits)}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex w-full mt-1">
        {fields.map((f) => (
          <div key={f.name} style={{ width: `${(f.bits / 16) * 100}%` }} className="text-center">
            <span className="text-[9px] text-[var(--color-muted)]">
              [{f.start}:{f.start + f.bits - 1}]
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
