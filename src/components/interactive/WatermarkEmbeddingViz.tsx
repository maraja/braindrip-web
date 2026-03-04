import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const STEPS = [
  {
    title: 'Token Vocabulary Split',
    desc: 'At each position, the vocabulary is secretly split into a "green list" and "red list" based on a hash of the previous token.',
    visual: [
      { token: 'the', list: 'green' }, { token: 'a', list: 'red' }, { token: 'an', list: 'red' },
      { token: 'cat', list: 'green' }, { token: 'dog', list: 'red' }, { token: 'bird', list: 'green' },
      { token: 'sat', list: 'green' }, { token: 'ran', list: 'red' }, { token: 'flew', list: 'green' },
      { token: 'on', list: 'green' }, { token: 'in', list: 'red' }, { token: 'by', list: 'red' },
    ],
  },
  {
    title: 'Green List Bias',
    desc: 'During sampling, add a small constant (delta) to green list token logits, making them slightly more likely to be selected.',
    visual: [
      { token: 'the', list: 'green', boosted: true }, { token: 'a', list: 'red', boosted: false },
      { token: 'cat', list: 'green', boosted: true }, { token: 'dog', list: 'red', boosted: false },
      { token: 'sat', list: 'green', boosted: true }, { token: 'ran', list: 'red', boosted: false },
    ],
  },
  {
    title: 'Watermarked Output',
    desc: 'The resulting text has a statistically higher proportion of green list tokens than expected by chance — this is the watermark.',
    visual: [
      { token: 'The', list: 'green' }, { token: 'cat', list: 'green' }, { token: 'sat', list: 'green' },
      { token: 'on', list: 'green' }, { token: 'the', list: 'green' }, { token: 'warm', list: 'red' },
      { token: 'mat', list: 'green' }, { token: 'and', list: 'green' }, { token: 'purred', list: 'green' },
      { token: 'softly', list: 'red' }, { token: 'while', list: 'green' }, { token: 'resting', list: 'green' },
    ],
  },
];

export default function WatermarkEmbeddingViz() {
  const [stepIdx, setStepIdx] = useState(0);
  const step = STEPS[stepIdx];

  const greenCount = step.visual.filter(v => v.list === 'green').length;
  const greenPct = ((greenCount / step.visual.length) * 100).toFixed(0);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Watermark Embedding</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>See how statistical watermarks are embedded in LLM text using red/green token lists.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.25rem' }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flex: 1 }}>
            <button onClick={() => setStepIdx(i)} style={{
              flex: 1, padding: '0.5rem', borderRadius: '8px',
              border: `2px solid ${stepIdx === i ? '#2C3E2D' : '#E5DFD3'}`,
              background: stepIdx === i ? '#2C3E2D08' : i < stepIdx ? '#8BA88808' : 'transparent',
              cursor: 'pointer', textAlign: 'center' as const,
              fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.75rem', fontWeight: 600,
              color: stepIdx === i ? '#2C3E2D' : '#5A6B5C',
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', fontWeight: 700 }}>{i + 1}</div>
              <div>{s.title}</div>
            </button>
            {i < STEPS.length - 1 && <span style={{ color: '#C5BFB3', fontSize: '0.7rem' }}>→</span>}
          </div>
        ))}
      </div>

      <div style={{ fontSize: '0.85rem', color: '#5A6B5C', marginBottom: '1rem', lineHeight: 1.6 }}>{step.desc}</div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.35rem' }}>
          {step.visual.map((v, i) => (
            <span key={i} style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', fontWeight: 600,
              padding: '0.3rem 0.55rem', borderRadius: '6px',
              background: v.list === 'green' ? '#8BA88820' : '#C76B4A15',
              color: v.list === 'green' ? '#6E8B6B' : '#C76B4A',
              border: `1px solid ${v.list === 'green' ? '#8BA88840' : '#C76B4A30'}`,
            }}>{v.token}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#8BA88830', border: '1px solid #8BA88850' }} />
          <span style={{ fontSize: '0.75rem', color: '#6E8B6B', fontWeight: 600 }}>Green List ({greenCount})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#C76B4A20', border: '1px solid #C76B4A40' }} />
          <span style={{ fontSize: '0.75rem', color: '#C76B4A', fontWeight: 600 }}>Red List ({step.visual.length - greenCount})</span>
        </div>
      </div>

      <div style={{ padding: '0.6rem 0.85rem', borderRadius: '8px', background: stepIdx === 2 ? '#8BA88810' : '#F5F0E6', border: `1px solid ${stepIdx === 2 ? '#8BA88833' : '#E5DFD3'}` }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', fontWeight: 700, color: parseInt(greenPct) > 60 ? '#8BA888' : '#5A6B5C' }}>
          Green token ratio: {greenPct}%
        </span>
        <span style={{ fontSize: '0.78rem', color: '#8B9B8D', marginLeft: '0.5rem' }}>
          (expected ~50% without watermark)
        </span>
      </div>
    </div>
  );
}
