import { Link } from 'react-router-dom';
import { Cpu, Layers, CheckCircle2, XCircle, Percent, ArrowRight, BookOpen } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { INSTRUCTION_SET, FORMATS } from '../data/instructions';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';

export default function Dashboard() {
  const { history } = useAppContext();
  const total = history.length;
  const valid = history.filter((h) => h.success).length;
  const invalid = total - valid;
  const rate = total ? Math.round((valid / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-8 fade-in-up">
      {/* Hero */}
      <section className="panel p-6 lg:p-10 relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-[var(--color-phosphor)]/5 blur-3xl" />
        <div className="absolute -left-16 bottom-0 w-56 h-56 rounded-full bg-[var(--color-amber)]/5 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--color-phosphor)] pulse-glow" />
            <span className="text-xs uppercase tracking-widest text-[var(--color-muted)]">DECODE.SIM</span>
          </div>
          <h1 className="font-mono-display text-3xl lg:text-5xl font-extrabold tracking-tight mb-3">
            Instruction Decoding <span className="text-[var(--color-amber)]">Algorithms</span>
          </h1>
          <p className="text-[var(--color-muted)] max-w-2xl leading-relaxed mb-6">
            An interactive simulator that shows, bit by bit, how a CPU turns raw machine code into
            an opcode, operands, and control signals during the <strong className="text-[var(--color-text)]">Decode</strong> stage
            of the instruction cycle — built on a simplified, RISC-V-inspired 16-bit instruction set.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/simulator"
              className="inline-flex items-center gap-2 bg-[var(--color-amber)] text-[#1a1200] font-semibold px-5 py-3 rounded-lg hover:brightness-110 transition"
            >
              <Cpu size={18} /> Launch Simulator <ArrowRight size={16} />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 border border-[var(--color-line)] text-[var(--color-text)] font-medium px-5 py-3 rounded-lg hover:bg-[var(--color-panel-2)] transition"
            >
              <BookOpen size={16} /> About the Project
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Instructions" value={INSTRUCTION_SET.length} sublabel="Supported mnemonics" accent="amber" icon={Cpu} />
        <StatCard label="Formats" value={Object.keys(FORMATS).length} sublabel="R / I / S / B / J" accent="blue" icon={Layers} />
        <StatCard label="Decoded" value={total} sublabel="This session" accent="phosphor" icon={Cpu} />
        <StatCard label="Valid" value={valid} sublabel="Successful decodes" accent="phosphor" icon={CheckCircle2} />
        <StatCard label="Success Rate" value={`${rate}%`} sublabel={`${invalid} invalid`} accent={rate >= 50 || total === 0 ? 'phosphor' : 'red'} icon={Percent} />
      </section>

      {/* Supported instructions + formats */}
      <section className="grid lg:grid-cols-2 gap-6">
        <div className="panel p-5">
          <h2 className="font-mono-display font-semibold mb-4 text-sm uppercase tracking-wide text-[var(--color-muted)]">
            Supported Instructions
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {INSTRUCTION_SET.map((i) => (
              <div key={i.mnemonic} className="flex items-center justify-between bg-[var(--color-panel-2)] rounded-lg px-3 py-2 border border-[var(--color-line)]">
                <span className="font-mono-display font-semibold text-sm">{i.mnemonic}</span>
                <Badge category={i.category}>{i.format}-Type</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="font-mono-display font-semibold mb-4 text-sm uppercase tracking-wide text-[var(--color-muted)]">
            Supported Formats
          </h2>
          <div className="flex flex-col gap-3">
            {Object.values(FORMATS).map((f) => (
              <div key={f.id} className="flex items-start gap-3 bg-[var(--color-panel-2)] rounded-lg px-3 py-2.5 border border-[var(--color-line)]">
                <span className="font-mono-display text-[var(--color-amber)] font-bold text-sm w-14 shrink-0">{f.name}</span>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
