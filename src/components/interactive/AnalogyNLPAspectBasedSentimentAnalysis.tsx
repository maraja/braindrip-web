import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPAspectBasedSentimentAnalysis() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine reading a restaurant review: "The pasta was delicious, the ambiance was romantic, but the waiter was rude and the prices were outrageous." A document-level sentiment system might rate this as mixed or slightly negative. But that single score misses the rich, aspect-specific structure of the opinion.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Aspect term extraction identifies the specific entities or features being discussed in a sentence. In "The battery life is amazing but the screen resolution is disappointing," the aspect terms are "battery life" and "screen resolution.' },
    { emoji: '🔍', label: 'In Detail', text: 'Think of ABSA as a microscope for opinions. Where standard sentiment analysis gives you the big picture (overall positive or negative), ABSA zooms in to show exactly which features of a product, service, or experience are praised or criticized.' },
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
