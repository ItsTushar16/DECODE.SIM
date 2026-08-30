import { useEffect, useMemo, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, AlertTriangle } from 'lucide-react';
import { validateAndNormalize } from '../simulator/validator';
import { decodeBinary } from '../simulator/decoder';
import { encodeInstruction } from '../simulator/encoder';
import BitFieldStrip from '../components/BitFieldStrip';

const SAMPLES = ['ADD R1, R2, R3', 'ANDI R2, R1, 5', 'LOAD R3, 4(R2)', 'BEQ R1, R2, 3', 'JAL R7, 10'];

function buildSteps(result) {
  if (!result?.success) return [];
  const { binary, format, definition, operands, controlSignals, assembly } = result;
  return [
    {
      title: 'Instruction Fetched',
      body: `The ${binary.length}-bit instruction word is fetched from Instruction Memory at the address held in the Program Counter (PC).`,
      node: 'fetch',
    },
    {
      title: 'Loaded into Instruction Register',
      body: 'The fetched word is placed into the Instruction Register (IR), where the decoder can read it.',
      node: 'ir',
      show: <CodeLine binary={binary} />,
    },
    {
      title: 'Opcode Extracted',
      body: `Bits [0:3] are read as the opcode: ${result.opcode}. The opcode tells the control unit which instruction family this is (${definition.category}).`,
      node: 'opcode',
      show: <BitFieldStrip fields={format.fields.filter((f) => f.name === 'opcode')} binary={binary} compact />,
    },
    {
      title: 'Instruction Format Identified',
      body: `Opcode ${result.opcode} maps to the ${format.name} (${format.fullName}) layout, so the decoder knows exactly how to slice up the remaining bits.`,
      node: 'format',
    },
    {
      title: 'Operands / Register Fields Extracted',
      body: 'The remaining fields are sliced according to the format and converted into register names / immediate values.',
      node: 'operands',
      show: <BitFieldStrip fields={format.fields} binary={binary} compact />,
    },
    {
      title: 'Control Signals Generated',
      body: 'The control unit sets signals that steer the rest of the datapath — whether to read/write registers, which ALU operation to run, and whether memory or a branch is involved.',
      node: 'control',
      show: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {Object.entries(controlSignals).map(([k, v]) => (
            <div key={k} className="text-[10px] font-mono-display bg-[var(--color-panel-2)] border border-[var(--color-line)] rounded px-2 py-1 flex justify-between">
              <span className="text-[var(--color-muted)]">{k}</span>
              <span className={typeof v === 'boolean' ? (v ? 'text-[var(--color-phosphor)]' : 'text-[var(--color-muted)]') : 'text-[var(--color-blue)]'}>
                {typeof v === 'boolean' ? (v ? 'ON' : 'OFF') : v}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Final Instruction Decoded',
      body: `Decoding is complete: ${assembly}. ${definition.description}`,
      node: 'done',
      show: (
        <div className="mt-2 font-mono-display text-[var(--color-amber)] font-bold text-lg">{assembly}</div>
      ),
    },
  ];
}

const PIPELINE_NODES = [
  { id: 'fetch', label: 'Instruction Memory' },
  { id: 'ir', label: 'Instruction Register' },
  { id: 'opcode', label: 'Decoder' },
  { id: 'operands', label: 'Field Extraction' },
  { id: 'control', label: 'Control Signals' },
  { id: 'done', label: 'Decoded Result' },
];

export default function StepByStep() {
  const [input, setInput] = useState('ADD R1, R2, R3');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  function load(assembly) {
    const norm = validateAndNormalize(assembly, 'assembly');
    if (!norm.valid) {
      setError(norm.error);
      setResult(null);
      return;
    }
    const enc = encodeInstruction(norm.mnemonic, norm.operands);
    const decoded = decodeBinary(enc.binary);
    if (!decoded.success) {
      setError(decoded.error);
      setResult(null);
      return;
    }
    setError(null);
    setResult(decoded);
    setStepIdx(0);
    setPlaying(false);
  }

  useEffect(() => {
    load(input);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const steps = useMemo(() => buildSteps(result), [result]);

  useEffect(() => {
    if (!playing) return;
    if (stepIdx >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStepIdx((i) => Math.min(i + 1, steps.length - 1)), 1600);
    return () => clearTimeout(t);
  }, [playing, stepIdx, steps.length]);

  const activeNode = steps[stepIdx]?.node;

  return (
    <div className="flex flex-col gap-6 fade-in-up">
      <div className="panel p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load(input)}
            className="flex-1 bg-[var(--color-panel-2)] border border-[var(--color-line)] rounded-lg px-4 py-2.5 font-mono-display text-sm focus:outline-none focus:border-[var(--color-amber)]"
          />
          <button
            onClick={() => load(input)}
            className="bg-[var(--color-amber)] text-[#1a1200] font-semibold px-5 py-2.5 rounded-lg text-sm"
          >
            Load Instruction
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setInput(s);
                load(s);
              }}
              className="text-xs font-mono-display px-3 py-1.5 rounded-md bg-[var(--color-panel-2)] border border-[var(--color-line)] hover:border-[var(--color-phosphor)] hover:text-[var(--color-phosphor)] transition"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="panel border-[var(--color-red)]/40 p-5 flex gap-3 items-start">
          <AlertTriangle className="text-[var(--color-red)] shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-mono-display font-bold text-[var(--color-red)]">{error.title}</p>
            <p className="text-sm text-[var(--color-text)] mt-1">{error.reason}</p>
          </div>
        </div>
      )}

      {result && (
        <>
          {/* Pipeline diagram */}
          <div className="panel p-6 overflow-x-auto">
            <div className="flex items-center min-w-[640px]">
              {PIPELINE_NODES.map((n, idx) => (
                <div key={n.id} className="flex items-center flex-1">
                  <div
                    className={`flex-1 rounded-lg border px-3 py-4 text-center transition-all ${
                      activeNode === n.id
                        ? 'border-[var(--color-amber)] bg-[var(--color-amber)]/10 glow-amber'
                        : idx < PIPELINE_NODES.findIndex((x) => x.id === activeNode)
                        ? 'border-[var(--color-phosphor-dim)] bg-[var(--color-phosphor)]/5'
                        : 'border-[var(--color-line)] bg-[var(--color-panel-2)]'
                    }`}
                  >
                    <p
                      className={`text-xs font-mono-display font-semibold ${
                        activeNode === n.id ? 'text-[var(--color-amber)]' : 'text-[var(--color-text)]'
                      }`}
                    >
                      {n.label}
                    </p>
                  </div>
                  {idx < PIPELINE_NODES.length - 1 && (
                    <svg width="28" height="16" className="shrink-0 mx-1">
                      <line x1="0" y1="8" x2="24" y2="8" stroke="var(--color-line)" strokeWidth="2" className={activeNode && PIPELINE_NODES.findIndex((x) => x.id === activeNode) > idx ? 'flow-line' : ''} style={{stroke: 'var(--color-phosphor-dim)'}} />
                      <polygon points="20,3 28,8 20,13" fill="var(--color-line)" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step card */}
          <div className="panel p-6 min-h-[220px]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
                Step {stepIdx + 1} of {steps.length}
              </span>
              <div className="flex gap-1">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${i === stepIdx ? 'bg-[var(--color-amber)]' : i < stepIdx ? 'bg-[var(--color-phosphor)]' : 'bg-[var(--color-line)]'}`}
                  />
                ))}
              </div>
            </div>
            <h3 className="font-mono-display text-lg font-bold text-[var(--color-amber)] mb-2">{steps[stepIdx]?.title}</h3>
            <p className="text-sm text-[var(--color-text)] leading-relaxed">{steps[stepIdx]?.body}</p>
            {steps[stepIdx]?.show}
          </div>

          {/* Controls */}
          <div className="panel p-4 flex items-center justify-center gap-3">
            <ControlBtn onClick={() => { setPlaying(false); setStepIdx(0); }} icon={RotateCcw} label="Reset" />
            <ControlBtn onClick={() => { setPlaying(false); setStepIdx((i) => Math.max(0, i - 1)); }} icon={SkipBack} label="Previous" />
            <button
              onClick={() => setPlaying((p) => !p)}
              className="w-12 h-12 rounded-full bg-[var(--color-amber)] text-[#1a1200] flex items-center justify-center hover:brightness-110"
            >
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <ControlBtn onClick={() => { setPlaying(false); setStepIdx((i) => Math.min(steps.length - 1, i + 1)); }} icon={SkipForward} label="Next" />
          </div>
        </>
      )}
    </div>
  );
}

function ControlBtn({ onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="w-10 h-10 rounded-full border border-[var(--color-line)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-phosphor)] transition"
    >
      <Icon size={16} />
    </button>
  );
}

function CodeLine({ binary }) {
  return <p className="mt-2 font-mono-display text-sm text-[var(--color-phosphor)] tracking-widest">{binary}</p>;
}
