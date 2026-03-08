import { useState } from 'react';

const DETAILS = [
    { label: 'Bahdanau attention paper', detail: 'September 2014 (arXiv:1409.0473), published at ICLR 2015; over 30,000 citations' },
    { label: 'Luong attention paper', detail: 'August 2015 (arXiv:1508.04025), published at EMNLP 2015' },
    { label: 'BLEU improvement', detail: 'Bahdanau attention: ~26 BLEU vs ~19 for non-attention Seq2Seq on EN-FR (comparable data setup), with the gap widening dramatically for longer sentences' },
    { label: 'Computational cost', detail: 'Bahdanau (additive) is O(d) per score computation; Luong (dot-product) is O(d) but with smaller constants and better GPU utilization via batched matrix multiply' },
    { label: 'Attention weight interpretability', detail: 'Attention heatmaps closely correlate with linguistic alignment, making the mechanism somewhat interpretable — a rare property in deep learning' },
    { label: 'Adoption timeline', detail: 'By 2016, attention was standard in all competitive neural MT systems; by 2017, Google Translate switched to attention-based neural MT (GNMT)' },
];

export default function ExplorerLLE04AttentionMechanismOrigins() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Attention Mechanism Origins \u2014 Key Details Explorer
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
