import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEManyShotPrompting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think about the difference between showing someone 3 vacation photos and showing them a full album. With 3 photos, they get the general idea — you went to a beach, it looked sunny, you had fun.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The quality curve as example count increases follows a characteristic pattern:  0 examples (zero-shot): Baseline performance, often 60-80% on classification tasks. 3-8 examples (few-shot): Significant jump, capturing format and basic patterns. Typically 80-90%.' },
    { emoji: '🔍', label: 'In Detail', text: 'Many-shot prompting extends the few-shot paradigm from 3-8 examples to 20-500+ examples, made possible by the long context windows of modern models (128K-2M tokens). This crosses a qualitative threshold: with enough examples, the model can learn nuanced patterns, handle rare edge cases, and approximate the quality of models fine-tuned on the same.' },
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
