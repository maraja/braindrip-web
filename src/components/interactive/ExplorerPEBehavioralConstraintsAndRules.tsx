import { useState } from 'react';

const DETAILS = [
    { label: 'Numbered lists vs. prose', detail: 'Constraints formatted as numbered lists show 15-20% better compliance than equivalent constraints written in paragraph form, based on evaluation across multiple models and tasks.' },
    { label: 'Optimal constraint count', detail: '5-15 constraints is the practical range. Fewer than 5 usually means important rules are missing. More than 15 causes instruction competition and declining marginal compliance.' },
    { label: 'Position matters', detail: 'Place the highest-priority constraints at the top and bottom of the constraint section (primacy and recency effects). Medium-priority constraints go in the middle.' },
    { label: 'Specificity impact', detail: 'Replacing a vague constraint with a specific one (e.g., "be careful with PII" to "never include SSNs or credit card numbers") typically improves compliance by 20-30% for that specific rule.' },
    { label: 'Conditional rule compliance', detail: 'If-then rules are followed with 75-90% reliability in modern instruction-tuned models, compared to ~60% for implicit conditional logic.' },
    { label: 'Negative framing risk', detail: 'Negatively framed rules ("don\'t mention competitors") can paradoxically increase the probability of mentioning the prohibited content by priming the model with the concept. Positive reframing ("focus exclusively on our product features") avoids this.' },
];

export default function ExplorerPEBehavioralConstraintsAndRules() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Behavioral Constraints and Rules \u2014 Key Details Explorer
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
