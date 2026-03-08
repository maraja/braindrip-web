import { useState } from 'react';

const DETAILS = [
    { label: 'Confidence calibration', detail: 'Raw LLM confidence scores are often poorly calibrated (overconfident on wrong answers). Techniques like temperature scaling and Platt scaling improve calibration, making confidence-based triggers more reliable.' },
    { label: 'Query classification', detail: 'A lightweight classifier (or prompt-based classification) categorizes queries into retrieval-needed vs retrieval-unnecessary before the main generation, adding minimal overhead.' },
    { label: 'Retrieval cost model', detail: 'The decision framework uses an explicit cost model: expected accuracy gain from retrieval versus the cost (latency, tokens, money) of performing it. Retrieval is triggered when expected gain exceeds cost.' },
    { label: 'Fallback retrieval', detail: 'Even when the agent initially decides not to retrieve, it monitors its generation. If the model starts producing hedging language or low-confidence tokens mid-generation, it can pause and trigger retrieval (as in the FLARE method).' },
    { label: 'Domain-specific priors', detail: 'The system maintains per-domain statistics on when retrieval helps. Legal and medical questions almost always benefit from retrieval; general knowledge and coding syntax rarely do.' },
    { label: 'User feedback loop', detail: 'When users correct agent answers, the system logs whether retrieval was used. Over time, this feedback adjusts retrieval thresholds to fix blind spots.' },
];

export default function ExplorerAACDynamicRetrievalDecisions() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Dynamic Retrieval Decisions \u2014 Key Details Explorer
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
