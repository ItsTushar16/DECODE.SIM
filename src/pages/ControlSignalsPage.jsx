import { useState } from 'react';
import { INSTRUCTION_SET } from '../data/instructions';
import { generateControlSignals, SIGNAL_DESCRIPTIONS } from '../simulator/controlSignals';
import Badge from '../components/Badge';

export default function ControlSignalsPage() {
  const [selected, setSelected] = useState(INSTRUCTION_SET[0].mnemonic);
  const def = INSTRUCTION_SET.find((i) => i.mnemonic === selected);
  const signals = generateControlSignals(def);

  return (
    <div className="flex flex-col gap-6 fade-in-up">
      <div className="panel p-5">
        <p className="text-sm text-[var(--color-muted)] leading-relaxed">
          The <strong className="text-[var(--color-text)]">Control Unit</strong> is the part of the CPU that turns a decoded
          opcode into the electrical "steering" signals the rest of the datapath needs — whether to read or write
          registers, what the ALU should compute, and whether memory or the Program Counter should change. Select an
          instruction to see its simulated control signals.
        </p>
        <p className="text-[11px] text-[var(--color-amber)] mt-3 font-medium">
          These are SIMULATED control signals — not the literal internal design of any real CPU.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {INSTRUCTION_SET.map((i) => (
          <button
            key={i.mnemonic}
            onClick={() => setSelected(i.mnemonic)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-display font-semibold border ${
              selected === i.mnemonic
                ? 'border-[var(--color-amber)] text-[var(--color-amber)] bg-[var(--color-amber)]/10'
                : 'border-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {i.mnemonic}
          </button>
        ))}
      </div>

      <div className="panel p-6">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="font-mono-display text-xl font-bold">{def.mnemonic}</h2>
          <Badge category={def.category}>{def.category}</Badge>
        </div>
        <p className="text-sm text-[var(--color-muted)] mb-5">{def.description}</p>

        <div className="grid sm:grid-cols-2 gap-3">
          {Object.entries(signals).map(([sig, val]) => (
            <div key={sig} className="bg-[var(--color-panel-2)] border border-[var(--color-line)] rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono-display text-sm font-semibold">{sig}</span>
                {typeof val === 'boolean' ? (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      val ? 'bg-[var(--color-phosphor)]/15 text-[var(--color-phosphor)]' : 'bg-[var(--color-line)] text-[var(--color-muted)]'
                    }`}
                  >
                    {val ? 'ENABLED' : 'DISABLED'}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-blue)]/15 text-[var(--color-blue)]">{val}</span>
                )}
              </div>
              <p className="text-[11px] text-[var(--color-muted)]">{SIGNAL_DESCRIPTIONS[sig]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison table across all instructions */}
      <div className="panel p-5 overflow-x-auto">
        <h3 className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-3">All Instructions — Signal Comparison</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-[var(--color-muted)] border-b border-[var(--color-line)]">
              <th className="py-2 pr-3">Instr.</th>
              {Object.keys(signals).map((s) => (
                <th key={s} className="py-2 pr-3">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INSTRUCTION_SET.map((i) => {
              const s = generateControlSignals(i);
              return (
                <tr key={i.mnemonic} className="border-b border-[var(--color-line)]/60">
                  <td className="py-2 pr-3 font-mono-display font-semibold">{i.mnemonic}</td>
                  {Object.entries(s).map(([k, v]) => (
                    <td key={k} className="py-2 pr-3 font-mono-display">
                      {typeof v === 'boolean' ? (
                        <span className={v ? 'text-[var(--color-phosphor)]' : 'text-[var(--color-muted)]'}>{v ? '1' : '0'}</span>
                      ) : (
                        <span className="text-[var(--color-blue)]">{v}</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
