import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPBiasInNlp() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a mirror that does not reflect reality faithfully but instead exaggerates certain features -- making some people appear larger and others smaller. NLP systems act like this distorted mirror: they are trained on text written by humans, which encodes centuries of social stereotypes, power imbalances, and cultural assumptions.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Training Data Bias: Language models learn from web text, books, and news articles that reflect historical and ongoing societal biases. Common Crawl, a frequent pre-training source, over-represents English, Western perspectives, and majority viewpoints. Wikipedia, another major source, has ~80% male biography subjects.' },
    { emoji: '🔍', label: 'In Detail', text: 'Bias in NLP refers to systematic and unfair disparities in how models represent, process, or generate text related to different demographic groups. It is not merely about individual errors but about patterns: a sentiment classifier that systematically rates African American Vernacular English (AAVE) as more negative, a machine translation system.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u2726 KEY PERSPECTIVES</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' as const }}>
        {perspectives.map((p, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA88818' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {p.emoji} {p.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{perspectives[idx].text}</p>
    </div>
  );
}
