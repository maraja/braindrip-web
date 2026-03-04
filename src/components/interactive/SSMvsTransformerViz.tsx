import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const metrics = [
  { label: 'Training Speed', transformer: 85, ssm: 70, note: 'Transformers parallelize well on GPUs' },
  { label: 'Inference Speed', transformer: 40, ssm: 95, note: 'SSMs are O(1) per token at inference' },
  { label: 'Memory (Inference)', transformer: 30, ssm: 90, note: 'SSMs have fixed-size hidden state vs growing KV cache' },
  { label: 'Long Context', transformer: 50, ssm: 90, note: 'SSMs handle very long sequences efficiently' },
  { label: 'In-Context Learning', transformer: 95, ssm: 65, note: 'Attention excels at retrieving from context' },
  { label: 'Recall Accuracy', transformer: 95, ssm: 60, note: 'Attention can look back at any token directly' },
];

export default function SSMvsTransformerViz() {
  const [metricIdx, setMetricIdx] = useState(0);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>SSM vs Transformer</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare state space models (recurrence) vs transformer (attention) across dimensions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.6rem', background: 'rgba(199,107,74,0.06)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#C76B4A', fontWeight: 700, textTransform: 'uppercase' as const }}>Transformer</div>
          <div style={{ fontSize: '0.72rem', color: '#5A6B5C', marginTop: '0.2rem' }}>x₁,x₂,...,xₙ → Attention(Q,K,V) → y</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#7A8B7C', marginTop: '0.15rem' }}>O(n²) attention, full context access</div>
        </div>
        <div style={{ padding: '0.6rem', background: 'rgba(139,168,136,0.06)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#8BA888', fontWeight: 700, textTransform: 'uppercase' as const }}>State Space Model</div>
          <div style={{ fontSize: '0.72rem', color: '#5A6B5C', marginTop: '0.2rem' }}>h(t) = Ah(t-1) + Bx(t), y = Ch(t)</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#7A8B7C', marginTop: '0.15rem' }}>O(1) recurrence, fixed state size</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {metrics.map((m, i) => (
          <div key={m.label} onClick={() => setMetricIdx(i)} style={{ cursor: 'pointer', padding: '0.45rem 0.65rem', borderRadius: '6px', border: `1px solid ${metricIdx === i ? '#D4A843' : '#E5DFD3'}`, background: metricIdx === i ? 'rgba(212,168,67,0.05)' : 'transparent' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.3rem' }}>{m.label}</div>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.6rem', color: '#C76B4A', width: '20px' }}>T</span>
              <div style={{ flex: 1, background: '#E5DFD3', borderRadius: '3px', height: '8px' }}>
                <div style={{ width: `${m.transformer}%`, height: '100%', background: '#C76B4A', borderRadius: '3px', transition: 'width 0.3s' }} />
              </div>
              <div style={{ flex: 1, background: '#E5DFD3', borderRadius: '3px', height: '8px' }}>
                <div style={{ width: `${m.ssm}%`, height: '100%', background: '#8BA888', borderRadius: '3px', transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontSize: '0.6rem', color: '#8BA888', width: '20px' }}>S</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', background: '#F0EBE1', borderRadius: '6px', fontSize: '0.78rem', color: '#5A6B5C' }}>
        {metrics[metricIdx].note}
      </div>
    </div>
  );
}
