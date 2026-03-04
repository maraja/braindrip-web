import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const queries = [
  { q: 'What color is the fruit?', textOnly: 'I need more context. Which fruit are you referring to?', multimodal: 'The apple in the image is red with slight green patches near the stem.', imageDesc: '🍎 [Photo of a red apple]' },
  { q: 'Is this safe to eat?', textOnly: 'I cannot determine food safety without seeing the item.', multimodal: 'The bread shows blue-green mold spots. It is NOT safe to eat.', imageDesc: '🍞 [Photo of moldy bread]' },
  { q: 'How many people are here?', textOnly: 'I have no visual information to count people.', multimodal: 'There are 5 people visible: 3 standing in front, 2 seated behind.', imageDesc: '👥 [Photo of group at table]' },
];

export default function ModalityComparisonDemo() {
  const [queryIdx, setQueryIdx] = useState(0);
  const [showMultimodal, setShowMultimodal] = useState(false);
  const q = queries[queryIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Text-Only vs Multimodal</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>See how adding image input transforms model responses.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {queries.map((_, i) => (
          <button key={i} onClick={() => { setQueryIdx(i); setShowMultimodal(false); }} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${queryIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: queryIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent',
            color: queryIdx === i ? '#C76B4A' : '#5A6B5C', fontWeight: queryIdx === i ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>Query {i + 1}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#2C3E2D' }}>
        Q: "{q.q}"
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #E5DFD3', background: '#FDFBF7' }}>
          <div style={{ fontSize: '0.65rem', color: '#C76B4A', fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: '0.5rem' }}>Text-Only LLM</div>
          <div style={{ fontSize: '0.8rem', color: '#5A6B5C', lineHeight: 1.5 }}>{q.textOnly}</div>
        </div>
        <div style={{ padding: '0.85rem', borderRadius: '8px', border: `1px solid ${showMultimodal ? '#8BA888' : '#E5DFD3'}`, background: showMultimodal ? 'rgba(139,168,136,0.05)' : '#FDFBF7' }}>
          <div style={{ fontSize: '0.65rem', color: '#8BA888', fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: '0.5rem' }}>Multimodal (Text+Image)</div>
          {showMultimodal ? (
            <>
              <div style={{ fontSize: '0.72rem', color: '#7A8B7C', marginBottom: '0.35rem' }}>{q.imageDesc}</div>
              <div style={{ fontSize: '0.8rem', color: '#2C3E2D', lineHeight: 1.5 }}>{q.multimodal}</div>
            </>
          ) : (
            <div style={{ fontSize: '0.8rem', color: '#B0A898', fontStyle: 'italic' }}>Click below to add image input...</div>
          )}
        </div>
      </div>

      <button onClick={() => setShowMultimodal(!showMultimodal)} style={{
        width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #8BA888',
        background: showMultimodal ? '#8BA888' : 'transparent', color: showMultimodal ? '#fff' : '#8BA888',
        fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
      }}>{showMultimodal ? 'Remove Image Input' : 'Add Image Input'}</button>
    </div>
  );
}
