import { useState } from 'react';

const DETAILS = [
    { label: 'Kim (2014) performance', detail: 'SST-2 binary sentiment: 88.1% accuracy. MR (movie reviews): 81.5%. TREC question classification: 93.6%. Subjectivity: 93.4%. All with a model of approximately 400K parameters.' },
    { label: 'ConvS2S (Gehring et al., 2017)', detail: '51 BLEU on WMT\'14 En-Fr (vs. 38.95 for GNMT with attention). Trained in 1.5 days on 8 GPUs vs. 14 days for the RNN baseline.' },
    { label: 'Filter dimensions', detail: 'For 300-dimensional embeddings and filter width 3, each filter has 3 * 300 = 900 parameters plus bias. With 100 filters per width and 3 widths, the convolutional layers have approximately 270K parameters.' },
    { label: 'Receptive field', detail: 'A k-layer CNN with filter width w has a receptive field of k * (w - 1) + 1. For w = 3 and k = 5 layers, this covers 11 tokens. With dilated convolutions (dilation 1, 2, 4, 8, 16), the same 5 layers cover 2^5 = 32 tokens.' },
    { label: 'Comparison to RNNs on classification', detail: 'CNNs often match or exceed LSTMs on sentence-level classification but underperform on tasks requiring long-range dependencies (e.g., document-level sentiment, coreference resolution).' },
    { label: 'Computational complexity', detail: 'O(k  n  d^2) for k layers, n positions, d dimensions -- compared to O(n  d^2) for an RNN (but sequential) and O(n^2  d) for self-attention.' },
];

export default function ExplorerNLPConvolutionalModelsForText() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Convolutional Models for Text \u2014 Key Details Explorer
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
