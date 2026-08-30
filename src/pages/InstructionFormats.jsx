import { useState } from 'react';
import { FORMATS, INSTRUCTION_SET } from '../data/instructions';
import BitFieldStrip from '../components/BitFieldStrip';
import Badge from '../components/Badge';

export default function InstructionFormats() {
  const [selectedFormat, setSelectedFormat] = useState('R');
  const [selectedField, setSelectedField] = useState(null);
  const format = FORMATS[selectedFormat];
  const examples = INSTRUCTION_SET.filter((i) => i.format === selectedFormat);

  return (
    <div className="flex flex-col gap-6 fade-in-up">
      <div className="flex flex-wrap gap-2">
        {Object.values(FORMATS).map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setSelectedFormat(f.id);
              setSelectedField(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-mono-display font-semibold border ${
              selectedFormat === f.id
                ? 'border-[var(--color-amber)] text-[var(--color-amber)] bg-[var(--color-amber)]/10'
                : 'border-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="panel p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-mono-display text-xl font-bold">{format.fullName}</h2>
          <span className="text-xs text-[var(--color-muted)]">e.g. {format.example}</span>
        </div>
        <p className="text-sm text-[var(--color-muted)] mb-6 leading-relaxed">{format.description}</p>

        <BitFieldStrip fields={format.fields} binary={null} onSelectField={setSelectedField} />

        {selectedField && (
          <div className="mt-5 panel !bg-[var(--color-panel-2)] p-4 fade-in-up">
            <p className="font-mono-display font-bold text-[var(--color-amber)] mb-1">{selectedField.name}</p>
            <p className="text-xs text-[var(--color-muted)] mb-1">
              Bits [{selectedField.start}:{selectedField.start + selectedField.bits - 1}] — {selectedField.bits} bit(s)
            </p>
            <p className="text-sm text-[var(--color-text)]">{selectedField.purpose}</p>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-3">
            Field Reference
          </h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {format.fields.map((f) => (
              <div key={f.name} className="bg-[var(--color-panel-2)] border border-[var(--color-line)] rounded-lg px-3 py-2 text-xs">
                <span className="font-mono-display font-semibold text-[var(--color-text)]">{f.name}</span>
                <span className="text-[var(--color-muted)]"> — bits [{f.start}:{f.start + f.bits - 1}] — {f.purpose}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel p-5">
        <h3 className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-3">
          Instructions Using {format.name}
        </h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {examples.map((i) => (
            <div key={i.mnemonic} className="flex items-center justify-between bg-[var(--color-panel-2)] border border-[var(--color-line)] rounded-lg px-3 py-2.5">
              <div>
                <p className="font-mono-display font-semibold text-sm">{i.mnemonic}</p>
                <p className="text-[10px] text-[var(--color-muted)]">{i.syntax}</p>
              </div>
              <Badge category={i.category}>{i.category}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
