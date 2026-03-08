import { useState } from 'react';

const DETAILS = [
    { label: 'Environment reproducibility', detail: 'Agent benchmarks require reproducible environments. SWE-bench uses specific repository commits and test suites. WebArena uses self-hosted web applications with deterministic state reset. Environment drift (changes to underlying systems) can invalidate benchmark results.' },
    { label: 'Evaluation cost', detail: 'A full SWE-bench Lite evaluation (300 tasks, multiple runs) costs $500-5,000 in API fees depending on the agent. WebArena requires hosting the web environments. Benchmark evaluation is a significant cost, limiting how frequently it can be run.' },
    { label: 'Leaderboard contamination', detail: 'As benchmarks become popular, training data contamination becomes a concern. Models or agents may have been exposed to benchmark tasks during training, inflating scores. New benchmarks and held-out test sets are needed to maintain evaluation integrity.' },
    { label: 'Benchmark saturation', detail: 'When top performance approaches human-level or 100%, the benchmark can no longer discriminate between agents. SWE-bench Lite is approaching this point, motivating harder variants. The community continually needs harder benchmarks as capabilities improve.' },
    { label: 'Multi-run evaluation', detail: 'Due to agent non-determinism, benchmark results should be reported as mean and standard deviation over multiple runs (typically 3-5). A single-run result is unreliable. Some leaderboards require multiple-run reporting.' },
    { label: 'Pass@k metric', detail: 'For coding benchmarks, pass@k measures the probability that at least one of k independent attempts succeeds. pass@1 is the standard single-attempt metric. pass@5 shows the agent\'s capability ceiling with retries.' },
];

export default function ExplorerAACAgentBenchmarks() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Agent Benchmarks \u2014 Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {DETAILS.map((d, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)} style={{
            textAlign: 'left' as const, background: open === i ? '#F0EBE1' : '#FDFBF7', border: '1px solid #E5DFD3',
            borderRadius: '10px', padding: '0.875rem 1rem', cursor: 'pointer', width: '100%', transition: 'background 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.95rem', fontWeight: 600, color: '#2C3E2D' }}>
                {d.label}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#7A8B7C', transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
                &#9654;
              </span>
            </div>
            {open === i && (
              <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: '0.5rem 0 0 0' }}>
                {d.detail}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
