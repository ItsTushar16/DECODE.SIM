import { useMemo, useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { INSTRUCTION_SET } from '../data/instructions';
import Badge from '../components/Badge';

export default function OpcodeExplorer() {
  const [query, setQuery] = useState('');
  const [lookupOpcode, setLookupOpcode] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase();
    if (!q) return INSTRUCTION_SET;
    return INSTRUCTION_SET.filter(
      (i) =>
        i.mnemonic.includes(q) ||
        i.opcode.includes(q) ||
        i.category.toUpperCase().includes(q) ||
        i.format.includes(q)
    );
  }, [query]);

  const lookupResult = useMemo(() => {
    const clean = lookupOpcode.trim();
    if (!clean) return null;
    if (!/^[01]{1,4}$/.test(clean)) {
      return { invalid: true, reason: 'Opcode must be a binary value between 1 and 4 bits.' };
    }
    const padded = clean.padStart(4, '0');
    const matches = INSTRUCTION_SET.filter((i) => i.opcode === padded);
    if (matches.length === 0) {
      return { invalid: true, reason: `Opcode ${padded} is not supported by the simulator.`, padded };
    }
    return { invalid: false, matches, padded };
  }, [lookupOpcode]);

  return (
    <div className="flex flex-col gap-6 fade-in-up">
      {/* Lookup */}
      <div className="panel p-5">
        <h3 className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-3">Opcode Lookup</h3>
        <input
          value={lookupOpcode}
          onChange={(e) => setLookupOpcode(e.target.value)}
          placeholder="Enter a 4-bit opcode, e.g. 0110"
          className="w-full sm:w-72 bg-[var(--color-panel-2)] border border-[var(--color-line)] rounded-lg px-4 py-2.5 font-mono-display text-sm focus:outline-none focus:border-[var(--color-amber)]"
        />
        {lookupResult && (
          <div className="mt-4">
            {lookupResult.invalid ? (
              <div className="flex gap-3 items-start bg-[var(--color-red)]/10 border border-[var(--color-red)]/30 rounded-lg p-4">
                <AlertTriangle className="text-[var(--color-red)] shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-mono-display font-bold text-[var(--color-red)]">INVALID INSTRUCTION</p>
                  <p className="text-sm text-[var(--color-text)] mt-1">Reason: {lookupResult.reason}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {lookupResult.matches.map((m) => (
                  <InstructionCard key={m.mnemonic} i={m} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search / filter */}
      <div className="panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Search size={16} className="text-[var(--color-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by mnemonic, opcode, format, or category..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-[var(--color-muted)] border-b border-[var(--color-line)]">
                <th className="py-2 pr-4">Instruction</th>
                <th className="py-2 pr-4">Opcode</th>
                <th className="py-2 pr-4">Format</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Operands</th>
                <th className="py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.mnemonic} className="border-b border-[var(--color-line)]/60 hover:bg-[var(--color-panel-2)]">
                  <td className="py-2.5 pr-4 font-mono-display font-semibold">{i.mnemonic}</td>
                  <td className="py-2.5 pr-4 font-mono-display text-[var(--color-amber)]">{i.opcode}{i.funct ? `.${i.funct}` : ''}</td>
                  <td className="py-2.5 pr-4">{i.format}-Type</td>
                  <td className="py-2.5 pr-4"><Badge category={i.category}>{i.category}</Badge></td>
                  <td className="py-2.5 pr-4 font-mono-display text-xs text-[var(--color-muted)]">{i.operands.join(', ')}</td>
                  <td className="py-2.5 text-xs text-[var(--color-muted)]">{i.description}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[var(--color-muted)] text-sm">
                    No instructions match "{query}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InstructionCard({ i }) {
  return (
    <div className="flex items-center justify-between bg-[var(--color-panel-2)] border border-[var(--color-line)] rounded-lg px-4 py-3">
      <div>
        <p className="font-mono-display font-bold text-[var(--color-phosphor)]">{i.mnemonic}</p>
        <p className="text-xs text-[var(--color-muted)]">{i.syntax}</p>
      </div>
      <Badge category={i.category}>{i.format}-Type</Badge>
    </div>
  );
}
