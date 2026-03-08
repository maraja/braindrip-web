import { useState } from 'react';

const DETAILS = [
    { label: 'Parameter sharing', detail: 'The same W_hh, W_xh, and W_hy are used at every time step, so the number of parameters is O(d_h^2 + d_h  d_x + d_h  d_y), independent of sequence length.' },
    { label: 'Hidden state dimensions', detail: 'Typical values range from 128 to 1024; Mikolov et al. (2010) used d_h = 250 for language modeling with a perplexity of approximately 124 on Penn Treebank.' },
    { label: 'Effective memory', detail: 'Vanilla RNNs can practically learn dependencies spanning only 5-20 time steps before gradients vanish below useful signal.' },
    { label: 'Training speed', detail: 'RNNs are inherently sequential -- each h_t depends on h_&#123;t-1&#125; -- so they cannot be parallelized across time steps. This makes them significantly slower to train than CNNs or Transformers on modern GPU hardware.' },
    { label: 'Gradient clipping threshold', detail: 'Values of 1.0 to 5.0 are standard; Pascanu et al. (2013) recommend clipping the global norm rather than element-wise.' },
    { label: 'Elman vs. Jordan networks', detail: 'The standard RNN (Elman, 1990) feeds h_&#123;t-1&#125; to the next step; Jordan networks (1986) instead feed the previous output y_&#123;t-1&#125;. Elman networks became the dominant form.' },
];

export default function ExplorerNLPRecurrentNeuralNetworks() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Recurrent Neural Networks \u2014 Key Details Explorer
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
