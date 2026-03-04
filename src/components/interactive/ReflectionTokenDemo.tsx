import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const examples = [
  {
    query: 'What year was Python created?',
    passage: 'Python was created by Guido van Rossum and first released in 1991.',
    response: 'Python was created in 1991 by Guido van Rossum.',
    isrel: { value: 'Relevant', score: 0.95, color: '#8BA888' },
    issup: { value: 'Fully Supported', score: 0.98, color: '#8BA888' },
    isuse: { value: '5 (Very Useful)', score: 5, color: '#8BA888' },
  },
  {
    query: 'What is the population of Mars?',
    passage: 'Mars is the fourth planet from the Sun with a thin atmosphere.',
    response: 'Mars has a population of about 2 million people.',
    isrel: { value: 'Partially Relevant', score: 0.40, color: '#D4A843' },
    issup: { value: 'Not Supported', score: 0.05, color: '#C76B4A' },
    isuse: { value: '1 (Not Useful)', score: 1, color: '#C76B4A' },
  },
  {
    query: 'How does photosynthesis work?',
    passage: 'Plants convert CO2 and water into glucose using sunlight via chlorophyll.',
    response: 'Photosynthesis uses quantum computing to process sunlight.',
    isrel: { value: 'Relevant', score: 0.88, color: '#8BA888' },
    issup: { value: 'Contradicts', score: 0.02, color: '#C76B4A' },
    isuse: { value: '1 (Not Useful)', score: 1, color: '#C76B4A' },
  },
];

export default function ReflectionTokenDemo() {
  const [exIdx, setExIdx] = useState(0);
  const ex = examples[exIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Reflection Token Demo</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>See how Self-RAG reflection tokens classify retrieval and response quality.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {examples.map((_, i) => (
          <button key={i} onClick={() => setExIdx(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${exIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: exIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: exIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: exIdx === i ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>Example {i + 1}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
        {[
          { label: 'Query', value: ex.query },
          { label: 'Passage', value: ex.passage },
          { label: 'Response', value: ex.response },
        ].map(item => (
          <div key={item.label} style={{ padding: '0.4rem 0.65rem', background: '#F0EBE1', borderRadius: '6px', display: 'flex', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 700, textTransform: 'uppercase' as const, minWidth: '50px' }}>{item.label}</span>
            <span style={{ fontSize: '0.75rem', color: '#2C3E2D' }}>{item.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
        {[
          { token: 'ISREL', label: 'Is Relevant?', data: ex.isrel },
          { token: 'ISSUP', label: 'Is Supported?', data: ex.issup },
          { token: 'ISUSE', label: 'Is Useful?', data: ex.isuse },
        ].map(item => (
          <div key={item.token} style={{ padding: '0.6rem', borderRadius: '8px', border: `1px solid ${item.data.color}30`, background: item.data.color + '08', textAlign: 'center' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: item.data.color, fontWeight: 700 }}>[{item.token}]</div>
            <div style={{ fontSize: '0.6rem', color: '#7A8B7C', marginTop: '0.1rem' }}>{item.label}</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: item.data.color, marginTop: '0.2rem' }}>{item.data.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
