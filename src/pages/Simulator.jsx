import { useState } from 'react';
import { Play, RefreshCcw, AlertTriangle, ArrowDownCircle, Wand2 } from 'lucide-react';
import { validateAndNormalize } from '../simulator/validator';
import { decodeBinary } from '../simulator/decoder';
import { encodeInstruction } from '../simulator/encoder';
import { INSTRUCTION_SET, REGISTER_COUNT, FORMATS } from '../data/instructions';
import { useAppContext } from '../context/AppContext';
import BitFieldStrip from '../components/BitFieldStrip';
import Badge from '../components/Badge';
import { SIGNAL_DESCRIPTIONS } from '../simulator/controlSignals';

const SAMPLES = [
  { label: 'ADD R1, R2, R3', type: 'assembly', value: 'ADD R1, R2, R3' },
  { label: 'SUB R4, R5, R6', type: 'assembly', value: 'SUB R4, R5, R6' },
  { label: 'ANDI R2, R1, 5', type: 'assembly', value: 'ANDI R2, R1, 5' },
  { label: 'LOAD R3, 4(R2)', type: 'assembly', value: 'LOAD R3, 4(R2)' },
  { label: 'BEQ R1, R2, 3', type: 'assembly', value: 'BEQ R1, R2, 3' },
  { label: 'JAL R7, 10', type: 'assembly', value: 'JAL R7, 10' },
];

export default function Simulator() {
  const { logDecode } = useAppContext();
  const [mode, setMode] = useState('decode'); // decode | encode
  const [inputType, setInputType] = useState('assembly');
  const [input, setInput] = useState('ADD R1, R2, R3');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Encoder state
  const [encMnemonic, setEncMnemonic] = useState('ADD');
  const [encFields, setEncFields] = useState({ rd: 1, rs1: 2, rs2: 3, imm: 0 });
  const [encResult, setEncResult] = useState(null);

  function runDecode(rawInput = input, type = inputType) {
    const normalized = validateAndNormalize(rawInput, type);
    if (!normalized.valid) {
      setError(normalized.error);
      setResult(null);
      logDecode({ input: rawInput, inputType: type, success: false, error: normalized.error });
      return;
    }

    let binary;
    if (type === 'assembly') {
      const enc = encodeInstruction(normalized.mnemonic, normalized.operands);
      if (!enc.success) {
        setError({ title: 'ENCODING ERROR', reason: enc.error, hint: '' });
        setResult(null);
        return;
      }
      binary = enc.binary;
    } else {
      binary = normalized.binary;
    }

    const decoded = decodeBinary(binary);
    if (!decoded.success) {
      setError(decoded.error);
      setResult(null);
      logDecode({ input: rawInput, inputType: type, success: false, error: decoded.error });
      return;
    }

    setError(null);
    setResult(decoded);
    logDecode({ input: rawInput, inputType: type, success: true, result: decoded });
  }

  function runEncode() {
    const res = encodeInstruction(encMnemonic, encFields);
    setEncResult(res);
  }

  function decodeEncodedResult() {
    if (!encResult?.success) return;
    setMode('decode');
    setInputType('binary');
    setInput(encResult.binary);
    runDecode(encResult.binary, 'binary');
  }

  const activeDef = INSTRUCTION_SET.find((i) => i.mnemonic === encMnemonic);

  return (
    <div className="flex flex-col gap-6 fade-in-up">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold border ${mode === 'decode' ? 'bg-[var(--color-amber)] text-[#1a1200] border-[var(--color-amber)]' : 'border-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-text)]'}`}
        >
          Decode
        </button>
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold border ${mode === 'encode' ? 'bg-[var(--color-phosphor)] text-[#04140c] border-[var(--color-phosphor)]' : 'border-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-text)]'}`}
        >
          Encode
        </button>
      </div>

      {mode === 'decode' ? (
        <>
          {/* Input panel */}
          <div className="panel p-5">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs uppercase tracking-wider text-[var(--color-muted)]">Input Type</span>
              {['assembly', 'binary', 'hex'].map((t) => (
                <button
                  key={t}
                  onClick={() => setInputType(t)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border capitalize ${
                    inputType === t
                      ? 'border-[var(--color-amber)] text-[var(--color-amber)] bg-[var(--color-amber)]/10'
                      : 'border-[var(--color-line)] text-[var(--color-muted)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runDecode()}
                placeholder={
                  inputType === 'assembly' ? 'e.g. ADD R1, R2, R3' : inputType === 'binary' ? 'e.g. 0110001010011000' : 'e.g. 0x6293'
                }
                className="flex-1 bg-[var(--color-panel-2)] border border-[var(--color-line)] rounded-lg px-4 py-3 font-mono-display text-sm focus:outline-none focus:border-[var(--color-amber)]"
              />
              <button
                onClick={() => runDecode()}
                className="inline-flex items-center justify-center gap-2 bg-[var(--color-amber)] text-[#1a1200] font-semibold px-5 py-3 rounded-lg hover:brightness-110 transition"
              >
                <Play size={16} /> Decode
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {SAMPLES.map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    setInputType(s.type);
                    setInput(s.value);
                    runDecode(s.value, s.type);
                  }}
                  className="text-xs font-mono-display px-3 py-1.5 rounded-md bg-[var(--color-panel-2)] border border-[var(--color-line)] hover:border-[var(--color-phosphor)] hover:text-[var(--color-phosphor)] transition"
                >
                  {s.label}
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
                {error.hint && <p className="text-xs text-[var(--color-muted)] mt-2">{error.hint}</p>}
              </div>
            </div>
          )}

          {result && <DecodeResultView result={result} />}
        </>
      ) : (
        <EncodeView
          encMnemonic={encMnemonic}
          setEncMnemonic={setEncMnemonic}
          encFields={encFields}
          setEncFields={setEncFields}
          activeDef={activeDef}
          runEncode={runEncode}
          encResult={encResult}
          decodeEncodedResult={decodeEncodedResult}
        />
      )}
    </div>
  );
}

function DecodeResultView({ result }) {
  const { binary, hex, format, definition, operands, controlSignals, assembly, category } = result;

  return (
    <div className="flex flex-col gap-6">
      {/* Flow */}
      <div className="panel p-5">
        <h3 className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-4">Representation</h3>
        <div className="grid sm:grid-cols-3 gap-3 font-mono-display">
          <RepBox label="Assembly" value={assembly} color="var(--color-amber)" />
          <RepBox label="Binary" value={binary} color="var(--color-phosphor)" small />
          <RepBox label="Hex" value={hex} color="var(--color-blue)" />
        </div>
      </div>

      {/* Bit field */}
      <div className="panel p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs uppercase tracking-wider text-[var(--color-muted)]">Binary Field Breakdown — {format.name}</h3>
          <Badge category={category}>{category}</Badge>
        </div>
        <BitFieldStrip fields={format.fields} binary={binary} />
        <p className="text-xs text-[var(--color-muted)] mt-4 leading-relaxed">{format.description}</p>
      </div>

      {/* Operands */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="panel p-5">
          <h3 className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-4">Operand Extraction</h3>
          <div className="flex flex-col gap-2">
            {Object.entries(operands).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between bg-[var(--color-panel-2)] border border-[var(--color-line)] rounded-lg px-4 py-2.5 font-mono-display text-sm">
                <span className="text-[var(--color-muted)]">{key}</span>
                {typeof val === 'object' ? (
                  <span>
                    <span className="text-[var(--color-blue)]">{val.binary}</span>
                    {' → '}
                    <span className="text-[var(--color-text)] font-bold">{val.name}</span>
                  </span>
                ) : (
                  <span className="text-[var(--color-text)] font-bold">{val}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <h3 className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-4">Simulated Control Signals</h3>
          <div className="flex flex-col gap-1.5">
            {Object.entries(controlSignals).map(([sig, val]) => (
              <SignalRow key={sig} name={sig} value={val} />
            ))}
          </div>
          <p className="text-[10px] text-[var(--color-muted)] mt-3 italic">
            Educational simplification — not an exact model of any commercial processor's internal signals.
          </p>
        </div>
      </div>

      {/* Final decoded instruction */}
      <div className="panel p-5 glow-amber">
        <h3 className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-3">Final Decoded Instruction</h3>
        <p className="font-mono-display text-lg font-bold text-[var(--color-amber)] mb-2">{assembly}</p>
        <p className="text-sm text-[var(--color-text)]">{definition.description}</p>
        <p className="font-mono-display text-xs text-[var(--color-muted)] mt-2">Semantics: {definition.semantics}</p>
      </div>
    </div>
  );
}

function RepBox({ label, value, color, small }) {
  return (
    <div className="bg-[var(--color-panel-2)] border border-[var(--color-line)] rounded-lg p-3">
      <p className="text-[10px] text-[var(--color-muted)] uppercase mb-1">{label}</p>
      <p className={`font-bold break-all ${small ? 'text-xs tracking-wider' : 'text-base'}`} style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function SignalRow({ name, value }) {
  const isBool = typeof value === 'boolean';
  const active = isBool ? value : true;
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-md bg-[var(--color-panel-2)] border border-[var(--color-line)]">
      <span className="text-xs font-mono-display text-[var(--color-muted)]">{name}</span>
      {isBool ? (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            value ? 'bg-[var(--color-phosphor)]/15 text-[var(--color-phosphor)]' : 'bg-[var(--color-line)] text-[var(--color-muted)]'
          }`}
        >
          {value ? 'ENABLED' : 'DISABLED'}
        </span>
      ) : (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-blue)]/15 text-[var(--color-blue)]">{value}</span>
      )}
    </div>
  );
}

function EncodeView({ encMnemonic, setEncMnemonic, encFields, setEncFields, activeDef, runEncode, encResult, decodeEncodedResult }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="panel p-5">
        <h3 className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-4 flex items-center gap-2">
          <Wand2 size={14} /> Build an Instruction
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[var(--color-muted)] block mb-1.5">Instruction</label>
            <select
              value={encMnemonic}
              onChange={(e) => setEncMnemonic(e.target.value)}
              className="w-full bg-[var(--color-panel-2)] border border-[var(--color-line)] rounded-lg px-3 py-2.5 font-mono-display text-sm"
            >
              {INSTRUCTION_SET.map((i) => (
                <option key={i.mnemonic} value={i.mnemonic}>
                  {i.mnemonic} — {i.syntax}
                </option>
              ))}
            </select>
          </div>
          {activeDef && (
            <div className="flex items-end">
              <p className="text-xs text-[var(--color-muted)]">{activeDef.description}</p>
            </div>
          )}
        </div>

        {activeDef && (
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            {activeDef.operands.map((op) => (
              <div key={op}>
                <label className="text-xs text-[var(--color-muted)] block mb-1.5 capitalize">{op}</label>
                {op === 'imm' ? (
                  <input
                    type="number"
                    value={encFields.imm}
                    onChange={(e) => setEncFields((f) => ({ ...f, imm: parseInt(e.target.value || '0', 10) }))}
                    className="w-full bg-[var(--color-panel-2)] border border-[var(--color-line)] rounded-lg px-3 py-2.5 font-mono-display text-sm"
                  />
                ) : (
                  <select
                    value={encFields[op]}
                    onChange={(e) => setEncFields((f) => ({ ...f, [op]: parseInt(e.target.value, 10) }))}
                    className="w-full bg-[var(--color-panel-2)] border border-[var(--color-line)] rounded-lg px-3 py-2.5 font-mono-display text-sm"
                  >
                    {Array.from({ length: REGISTER_COUNT }, (_, idx) => (
                      <option key={idx} value={idx}>
                        R{idx}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={runEncode}
          className="mt-5 inline-flex items-center gap-2 bg-[var(--color-phosphor)] text-[#04140c] font-semibold px-5 py-3 rounded-lg hover:brightness-110 transition"
        >
          <RefreshCcw size={16} /> Encode Instruction
        </button>
      </div>

      {encResult?.success && (
        <div className="panel p-5 glow-phosphor">
          <h3 className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-4">Generated Machine Code</h3>
          <BitFieldStrip fields={activeDef ? FORMATS[activeDef.format].fields : []} binary={encResult.binary} />
          <div className="mt-4 flex flex-wrap items-center gap-4 font-mono-display text-sm">
            <span className="text-[var(--color-phosphor)] font-bold">{encResult.binary}</span>
          </div>
          <button
            onClick={decodeEncodedResult}
            className="mt-4 inline-flex items-center gap-2 border border-[var(--color-line)] px-4 py-2 rounded-lg text-sm hover:border-[var(--color-amber)] hover:text-[var(--color-amber)] transition"
          >
            <ArrowDownCircle size={15} /> Decode This Instruction
          </button>
        </div>
      )}
    </div>
  );
}
