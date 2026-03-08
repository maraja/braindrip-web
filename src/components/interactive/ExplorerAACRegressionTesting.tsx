import { useState } from 'react';

const DETAILS = [
    { label: 'Test suite size', detail: 'A practical regression suite contains 50-200 tasks. Fewer tasks miss important capabilities; more tasks increase CI run time and cost. Prioritize breadth of coverage over depth in any single capability.' },
    { label: 'Run budget', detail: 'Each regression run costs money (LLM API calls). Budget approximately: (number of tasks) x (runs per task) x (cost per run). A 100-task suite with 3 runs each at 0.10/run costs 30 per CI run. Balance thoroughness against cost.' },
    { label: 'Baseline management', detail: 'Maintain a versioned baseline of expected performance metrics per task. Update the baseline when intentional changes shift the expected behavior (e.g., a capability improvement that changes the "correct" output for some tasks).' },
    { label: 'Flaky test handling', detail: 'Some tasks are inherently unreliable (50-70% success rate even in the baseline). These "flaky" tasks generate noise in regression results. Either improve them (make them more deterministic), exclude them from regression (but track separately), or use wider statistical thresholds for naturally.' },
    { label: 'Test isolation', detail: 'Each test task should be independent. Shared state between tests (reused sandbox, cached results, cumulative context) can cause cascade failures where one test\'s failure affects subsequent tests.' },
    { label: 'Evaluation oracle selection', detail: 'For each test, choose the appropriate evaluation method: exact match (deterministic outputs), test suite execution (coding tasks), LLM-as-judge (quality assessment), or custom validators (domain-specific criteria). The oracle must be more reliable than the agent being tested.' },
];

export default function ExplorerAACRegressionTesting() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Regression Testing \u2014 Key Details Explorer
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
