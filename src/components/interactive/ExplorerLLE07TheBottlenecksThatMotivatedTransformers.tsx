import { useState } from 'react';

const DETAILS = [
    { label: 'Sequential bottleneck', detail: 'RNNs require O(n) sequential operations for sequence length n; Transformers require O(1) (all positions processed in parallel)' },
    { label: 'Effective LSTM memory', detail: 'Empirically ~200 tokens (Khandelwal et al., 2018); Transformers scale to the full context window' },
    { label: 'Training time comparison', detail: 'GNMT (8-layer LSTM) took 6 days on 96 GPUs; the original Transformer achieved better results in 3.5 days on 8 GPUs — ~100x more efficient' },
    { label: 'BLEU comparison on WMT EN-DE', detail: 'GNMT ~24.6 BLEU; Transformer 28.4 BLEU — better results, vastly less compute' },
    { label: 'Hardware utilization', detail: 'RNNs achieved ~5-10% GPU utilization on modern hardware; Transformers achieved 50%+ by exploiting matrix multiply parallelism' },
    { label: 'Convolutional alternatives', detail: 'ConvS2S (Gehring et al., 2017) was 9x faster than LSTM Seq2Seq but still inferior to the Transformer in both speed and quality' },
];

export default function ExplorerLLE07TheBottlenecksThatMotivatedTransformers() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          The Bottlenecks That Motivated Transformers — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of the bottlenecks that motivated transformers.
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
