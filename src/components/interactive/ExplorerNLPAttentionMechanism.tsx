import { useState } from 'react';

const DETAILS = [
    { label: 'Bahdanau et al. (2014) results', detail: 'On WMT\'14 En-Fr, attention improved BLEU from 26.75 to 28.45 (basic RNNsearch) and to 36.15 with larger vocabulary and longer training, surpassing the previous best phrase-based system (33.30).' },
    { label: 'Luong et al. (2015) results', detail: 'On WMT\'15 En-De, the best attention variant (global, general scoring) achieved 25.9 BLEU, establishing multiplicative attention as the more efficient standard.' },
    { label: 'Computational cost', detail: 'Attention adds O(S  d) computation per decoder step (S = source length, d = hidden dimension). For the full output sequence of length T, total attention cost is O(T  S * d).' },
    { label: 'Memory', detail: 'Attention requires storing all S encoder hidden states in memory simultaneously, costing O(S * d) memory. For document-level translation (thousands of tokens), this motivated local attention variants and later sparse attention patterns.' },
    { label: 'Number of additional parameters', detail: 'Bahdanau (additive) attention adds approximately 3 * d^2 parameters (for W_a, U_a, v_a). Dot-product attention adds zero parameters. General (bilinear) attention adds d^2 parameters.' },
    { label: 'Attention visualization', detail: 'The alpha matrix for a source-target pair has dimensions T x S. For a 30-word source and 35-word target, this is a 35x30 heatmap that can be plotted directly.' },
];

export default function ExplorerNLPAttentionMechanism() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Attention Mechanism \u2014 Key Details Explorer
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
