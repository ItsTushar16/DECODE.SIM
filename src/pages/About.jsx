const GLOSSARY = [
  { term: 'Instruction', def: 'A single command given to the CPU, encoded as a fixed-length binary word in this simulator.' },
  { term: 'Opcode', def: 'The field of an instruction that identifies which operation the CPU should perform.' },
  { term: 'Operand', def: 'The data an instruction operates on — a register, or an immediate constant.' },
  { term: 'Instruction Register (IR)', def: 'A CPU register that holds the instruction currently being decoded/executed.' },
  { term: 'Program Counter (PC)', def: 'A register holding the memory address of the next instruction to fetch.' },
  { term: 'Instruction Format', def: 'The layout that defines which bit positions hold which fields for a class of instructions.' },
  { term: 'Control Unit', def: 'The CPU component that turns a decoded instruction into control signals for the rest of the datapath.' },
  { term: 'Control Signal', def: 'A simulated on/off or selector value that steers datapath components such as the ALU, memory, or registers.' },
  { term: 'Addressing Mode', def: 'The method an instruction uses to specify a memory address (e.g. base register + offset, used by LOAD/STORE here).' },
  { term: 'Decode Stage', def: 'The pipeline stage where a fetched instruction is interpreted into opcode, operands, and control signals.' },
];

const ALGORITHM = [
  'Read instruction',
  'Validate input',
  'Extract opcode',
  'Identify instruction format',
  'Extract required fields',
  'Decode operands',
  'Generate control signals',
  'Construct final decoded instruction',
  'Display result',
];

export default function About() {
  return (
    <div className="flex flex-col gap-6 fade-in-up">
      <div className="panel p-6">
        <h2 className="font-mono-display text-2xl font-bold mb-3">About This Project</h2>
        <p className="text-sm text-[var(--color-text)] leading-relaxed mb-3">
          <strong className="text-[var(--color-amber)]">Instruction Decoding Algorithms</strong> is an interactive
          simulator. It focuses specifically on the
          <strong> Decode</strong> stage of the instruction cycle: turning a raw machine-code word into an opcode,
          operands, instruction identity, and control signals.
        </p>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed">
          Instruction decoding is fundamental to computer architecture, but textbook explanations alone make it hard to
          visualize how bits become meaning. This simulator makes every stage of that process interactive: type an
          instruction (assembly, binary, or hex), and watch it move through fetch → register → decode → operand
          extraction → control signals → final result.
        </p>
      </div>

      <div className="panel p-6">
        <h3 className="font-mono-display font-semibold text-sm uppercase tracking-wide text-[var(--color-muted)] mb-4">
          Decoding Algorithm
        </h3>
        <div className="flex flex-col gap-2">
          {ALGORITHM.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[var(--color-panel-2)] border border-[var(--color-line)] flex items-center justify-center text-xs font-mono-display text-[var(--color-amber)] shrink-0">
                {i + 1}
              </span>
              <span className="text-sm">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-6">
        <h3 className="font-mono-display font-semibold text-sm uppercase tracking-wide text-[var(--color-muted)] mb-4">
          Key Concepts Glossary
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {GLOSSARY.map((g) => (
            <div key={g.term} className="bg-[var(--color-panel-2)] border border-[var(--color-line)] rounded-lg p-3">
              <p className="font-mono-display font-semibold text-[var(--color-phosphor)] text-sm mb-1">{g.term}</p>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">{g.def}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-6 border-[var(--color-amber)]/30">
        <h3 className="font-mono-display font-semibold text-sm uppercase tracking-wide text-[var(--color-amber)] mb-3">
          Scope &amp; Honest Limitations
        </h3>
        <ul className="text-sm text-[var(--color-muted)] leading-relaxed list-disc list-inside space-y-1.5">
          <li>This is a deliberately simplified, RISC-V-inspired 16-bit instruction set — not a full ISA implementation.</li>
          <li>Control signals are an educational model of the concept, not the literal internal design of any commercial CPU.</li>
          <li>The simulator focuses only on the Decode stage, not the full Fetch–Decode–Execute–Memory–Writeback pipeline.</li>
          <li>Analytics reflect only real activity generated during the current browser session.</li>
        </ul>
      </div>
    </div>
  );
}
