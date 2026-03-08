import { useState } from 'react';

const DETAILS = [
    { label: 'Test-as-oracle for coding', detail: 'For coding tasks, automated test suites serve as evaluation oracles. But tests can be incomplete (missing edge cases), overfitted (only testing the specific solution approach), or wrong (tests that pass for incorrect code).' },
    { label: 'Inter-annotator agreement', detail: 'For graded metrics using human evaluators, measure inter-annotator agreement (Cohen\'s kappa or Krippendorff\'s alpha). Agreement below 0.7 suggests the rubric needs refinement. Low agreement means the metric is measuring evaluator variance, not agent quality.' },
    { label: 'Aggregation methods', detail: 'When a task has multiple metric dimensions, aggregation method matters. Simple averaging weights all dimensions equally. Weighted averaging reflects dimension importance. Minimum score (weakest dimension determines the grade) enforces baseline quality across all dimensions.' },
    { label: 'Metric sensitivity', detail: 'A good metric is sensitive to meaningful quality differences and insensitive to irrelevant variation. A coding metric that scores formatting differences the same as logical errors has poor sensitivity. Test metrics on known-quality examples to verify they discriminate meaningfully.' },
    { label: 'Partial credit calibration', detail: 'Graded metrics need calibration: what score corresponds to "barely acceptable," "good," and "excellent"? Calibrate by scoring a set of known-quality outputs and adjusting the rubric until scores match expectations.' },
    { label: 'Time-to-completion as a metric', detail: 'Beyond quality, time to completion matters for user experience. Two agents that produce identical quality outputs differ meaningfully if one takes 10 seconds and the other takes 5 minutes.' },
];

export default function ExplorerAACTaskCompletionMetrics() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Task Completion Metrics \u2014 Key Details Explorer
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
