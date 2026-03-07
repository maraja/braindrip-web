import { useState } from 'react';

const DETAILS = [
    { label: 'WMT human evaluation', detail: 'Annually evaluates ~150 MT systems across 15+ language pairs using Direct Assessment with ~1,000 annotators and ~500,000 individual judgments.' },
    { label: 'Cost estimates', detail: 'Professional human evaluation for a single MT system on one language pair costs $2,000--$5,000. Crowdsourced evaluation via Amazon Mechanical Turk costs $500--$1,500 for the same scope.' },
    { label: 'Chatbot Arena', detail: '(Zheng et al., 2023): Uses pairwise comparison with crowdsourced human judges; over 500,000 votes have been collected, producing Elo ratings that are considered the most reliable LLM quality ranking.' },
    { label: 'Sample sizes', detail: 'A minimum of 100--200 evaluated outputs is typically needed for statistically significant system-level differences. Sentence-level significance requires 500+ items.' },
    { label: 'Annotation speed', detail: 'Experienced annotators evaluate ~20--40 sentences per hour for DA, or ~30--50 pairwise comparisons per hour.' },
    { label: 'LLM-as-judge', detail: 'Using GPT-4 or Claude as automated evaluators achieves ~80--85% agreement with human annotators on pairwise comparisons, offering a middle ground between automated metrics and full human evaluation.' },
];

export default function ExplorerNLPHumanEvaluationForNlp() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Human Evaluation for NLP — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of human evaluation for nlp.
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
