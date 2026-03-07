import { useState } from 'react';

const DETAILS = [
    { label: 'Calibration quality', detail: 'Frontier models (GPT-4, Claude 3.5+) show moderate calibration when asked for confidence scores, with typical rank correlations (Spearman\'s rho) of 0.3-0.5 between self-reported confidence and actual accuracy.' },
    { label: 'Confidence scale', detail: '1-10 numerical scales produce more granular signals than binary (certain/uncertain); 1-5 scales are a reasonable compromise between granularity and consistency.' },
    { label: 'Pre-answer reflection', detail: 'Asking the model to identify potential error modes before answering reduces hallucination rates by an estimated 10-20% on knowledge-intensive tasks.' },
    { label: 'Verbalized uncertainty', detail: 'Models that include hedging language in responses are rated as more trustworthy by users in human evaluation studies.' },
    { label: 'Overconfidence bias', detail: 'LLMs tend to be overconfident -- self-reported confidence is typically 10-20% higher than actual accuracy, meaning calibration corrections (e.g., treating a self-reported \"8\" as a \"6.5\") improve reliability.' },
    { label: 'Task dependency', detail: 'Metacognitive prompting is most useful for knowledge-intensive tasks (factual QA, analysis) and least useful for well-defined tasks (math, code) where the model either gets it right or clearly wrong.' },
];

export default function ExplorerPEMetacognitivePrompting() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Metacognitive Prompting — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of metacognitive prompting.
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
