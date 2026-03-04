import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyMoA() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '👥', label: 'Panel of Advisors', text: 'A CEO doesn\'t rely on one advisor — they consult a panel, then synthesize the best advice. Mixture of Agents queries multiple LLMs in parallel, then uses an aggregator model to synthesize their responses into a superior answer. The diversity of perspectives (different model architectures, training data, strengths) produces better results than any single model, similar to ensemble methods in traditional ML.' },
    { emoji: '🎵', label: 'Orchestra', text: 'An orchestra produces richer music than any solo instrument. MoA orchestrates multiple "instrument" models — each contributing their strengths. One model might excel at factual accuracy, another at creative expression, a third at structured reasoning. The aggregator acts as the conductor, combining these contributions into a harmonious, high-quality response that surpasses individual models.' },
    { emoji: '📰', label: 'Newsroom', text: 'A newsroom has multiple reporters covering a story from different angles, and an editor synthesizes them into a comprehensive article. MoA works the same way: multiple LLMs independently generate responses (like reporters), then an aggregator model (the editor) combines the best elements into a final answer. Research shows this can boost quality even when using multiple copies of the same model, since different sampling runs explore different solution paths.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
