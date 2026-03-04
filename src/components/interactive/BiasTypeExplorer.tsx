import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const BIAS_TYPES = [
  {
    name: 'Training Data Bias', icon: 'D', color: '#C76B4A',
    desc: 'Biases inherited from the data used to train the model.',
    examples: [
      { title: 'Representation Bias', detail: 'Certain groups are over/under-represented. Example: "doctor" predominantly associated with males in training text.' },
      { title: 'Historical Bias', detail: 'Data reflects historical inequities. Example: hiring data encodes past discrimination against women in tech roles.' },
      { title: 'Selection Bias', detail: 'Training data collected from non-representative sources. Example: English-centric web scraping underrepresents other languages.' },
    ],
  },
  {
    name: 'Algorithmic Bias', icon: 'A', color: '#D4A843',
    desc: 'Biases introduced or amplified by the model architecture and training process.',
    examples: [
      { title: 'Amplification Bias', detail: 'Model amplifies small biases in data. If 60% of "CEO" examples are male, model may produce 90% male CEO associations.' },
      { title: 'Optimization Bias', detail: 'Loss functions optimize for majority patterns, marginalizing minority viewpoints and edge cases.' },
      { title: 'Aggregation Bias', detail: 'Treating diverse populations as homogeneous. A single model may fail subgroups that need different treatment.' },
    ],
  },
  {
    name: 'Output Bias', icon: 'O', color: '#8BA888',
    desc: 'Biases that manifest in model outputs and downstream applications.',
    examples: [
      { title: 'Stereotype Propagation', detail: 'Model completes "The nurse checked her..." reinforcing gender stereotypes in generated text.' },
      { title: 'Sentiment Disparity', detail: 'Different sentiment expressed about different demographic groups. Names associated with some races receive more negative context.' },
      { title: 'Allocation Harm', detail: 'Biased outputs cause real resource allocation differences — loan approvals, hiring recommendations, content visibility.' },
    ],
  },
];

export default function BiasTypeExplorer() {
  const [typeIdx, setTypeIdx] = useState(0);
  const [exIdx, setExIdx] = useState(0);
  const type = BIAS_TYPES[typeIdx];
  const ex = type.examples[exIdx];

  const switchType = (i: number) => { setTypeIdx(i); setExIdx(0); };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Bias Type Explorer</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Explore how bias enters and manifests at different stages of the ML pipeline.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {BIAS_TYPES.map((t, i) => (
          <button key={i} onClick={() => switchType(i)} style={{
            flex: 1, padding: '0.6rem 0.5rem', borderRadius: '10px', border: `2px solid ${typeIdx === i ? t.color : '#E5DFD3'}`,
            background: typeIdx === i ? `${t.color}0D` : 'transparent', cursor: 'pointer', textAlign: 'center' as const,
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: t.color, marginBottom: '0.2rem' }}>{t.icon}</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: typeIdx === i ? '#2C3E2D' : '#5A6B5C' }}>{t.name}</div>
          </button>
        ))}
      </div>

      <div style={{ fontSize: '0.85rem', color: '#5A6B5C', marginBottom: '1rem', lineHeight: 1.6, padding: '0 0.25rem' }}>{type.desc}</div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.4rem', marginBottom: '1rem' }}>
        {type.examples.map((e, i) => (
          <button key={i} onClick={() => setExIdx(i)} style={{
            padding: '0.65rem 0.85rem', borderRadius: '8px', border: `1px solid ${exIdx === i ? type.color + '55' : '#E5DFD3'}`,
            background: exIdx === i ? `${type.color}0A` : 'transparent', cursor: 'pointer', textAlign: 'left' as const,
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.85rem', fontWeight: exIdx === i ? 600 : 400,
            color: exIdx === i ? '#2C3E2D' : '#5A6B5C', transition: 'all 0.2s',
          }}>{e.title}</button>
        ))}
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '1rem' }}>
        <div style={{ fontWeight: 700, color: type.color, fontSize: '0.88rem', marginBottom: '0.4rem' }}>{ex.title}</div>
        <div style={{ fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.7 }}>{ex.detail}</div>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
        {BIAS_TYPES.map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '60px', height: '4px', borderRadius: '2px', background: i <= typeIdx ? t.color : '#E5DFD3' }} />
            {i < BIAS_TYPES.length - 1 && <span style={{ color: '#C5BFB3', fontSize: '0.7rem' }}>→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
