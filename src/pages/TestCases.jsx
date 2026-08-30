import { useState } from 'react';
import { PlayCircle, CheckCircle2, XCircle } from 'lucide-react';
import { TEST_CASES, runTestCase } from '../simulator/testCases';

export default function TestCases() {
  const [results, setResults] = useState({});

  function runAll() {
    const next = {};
    TEST_CASES.forEach((tc) => {
      next[tc.id] = runTestCase(tc);
    });
    setResults(next);
  }

  function runOne(tc) {
    setResults((prev) => ({ ...prev, [tc.id]: runTestCase(tc) }));
  }

  const ran = Object.keys(results).length > 0;
  const passCount = Object.values(results).filter((r) => r.pass).length;

  return (
    <div className="flex flex-col gap-6 fade-in-up">
      <div className="panel p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-mono-display font-bold text-lg">Testing Module</h2>
          <p className="text-sm text-[var(--color-muted)]">
            {ran ? `${passCount} / ${TEST_CASES.length} test cases passed` : `${TEST_CASES.length} predefined test cases ready to run`}
          </p>
        </div>
        <button
          onClick={runAll}
          className="inline-flex items-center gap-2 bg-[var(--color-amber)] text-[#1a1200] font-semibold px-5 py-2.5 rounded-lg"
        >
          <PlayCircle size={18} /> Run All Tests
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {TEST_CASES.map((tc) => {
          const r = results[tc.id];
          return (
            <div key={tc.id} className="panel p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono-display text-[var(--color-muted)]">{tc.id}</span>
                  <h3 className="font-semibold text-sm">{tc.name}</h3>
                </div>
                <div className="flex items-center gap-3">
                  {r && (
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                        r.pass ? 'bg-[var(--color-phosphor)]/15 text-[var(--color-phosphor)]' : 'bg-[var(--color-red)]/15 text-[var(--color-red)]'
                      }`}
                    >
                      {r.pass ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {r.pass ? 'PASS' : 'FAIL'}
                    </span>
                  )}
                  <button
                    onClick={() => runOne(tc)}
                    className="text-xs border border-[var(--color-line)] px-3 py-1.5 rounded-lg hover:border-[var(--color-phosphor)] hover:text-[var(--color-phosphor)] transition"
                  >
                    Run
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 mt-3 text-xs font-mono-display">
                <InfoBlock label="Input" value={tc.input} />
                <InfoBlock label="Expected" value={r ? (r.expectedErrorTitle || r.expectedAssembly || tc.expected) : tc.expected} />
                <InfoBlock label="Actual" value={r ? r.actualDetail : '—'} highlight={r ? (r.pass ? 'phosphor' : 'red') : null} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoBlock({ label, value, highlight }) {
  return (
    <div className="bg-[var(--color-panel-2)] border border-[var(--color-line)] rounded-lg p-2.5">
      <p className="text-[9px] uppercase text-[var(--color-muted)] mb-0.5">{label}</p>
      <p
        className="break-words"
        style={{ color: highlight ? `var(--color-${highlight})` : 'var(--color-text)' }}
      >
        {value}
      </p>
    </div>
  );
}
