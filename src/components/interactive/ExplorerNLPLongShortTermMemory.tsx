import { useState } from 'react';

const DETAILS = [
    { label: 'Parameter count', detail: 'An LSTM layer with input dimension d_x and hidden dimension d_h has 4 * (d_h * (d_h + d_x) + d_h) parameters (four gate/candidate sets, each with weights and biases). For d_h = 512 and d_x = 300, that is roughly 1.66 million parameters per layer.' },
    { label: 'Typical hidden sizes', detail: '256 to 1024 units; Google\'s Neural Machine Translation system (GNMT, 2016) used 1024-unit LSTMs with 8 layers.' },
    { label: 'Forget gate bias initialization', detail: 'Jozefowicz et al. (2015) showed that initializing the forget gate bias to 1.0 or 2.0 significantly improves performance, ensuring the network defaults to remembering rather than forgetting at the start of training.' },
    { label: 'Dropout for LSTMs', detail: 'Standard dropout between layers works, but Gal and Ghahramani (2016) showed that applying the same dropout mask across time steps (variational dropout) is more principled and effective, with typical rates of 0.2-0.5.' },
    { label: 'Training cost', detail: 'A 2-layer LSTM with d_h = 512 on Penn Treebank achieves perplexity around 60-65 and trains in roughly 1-2 hours on a single GPU (2018 hardware).' },
    { label: 'Sequence length', detail: 'LSTMs can effectively learn dependencies over 100-200 time steps, compared to 10-20 for vanilla RNNs -- a 10x improvement, though still limited compared to Transformers.' },
];

export default function ExplorerNLPLongShortTermMemory() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Long Short-Term Memory — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of long short-term memory.
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
