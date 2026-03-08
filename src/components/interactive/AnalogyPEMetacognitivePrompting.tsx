import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEMetacognitivePrompting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a student preparing for an exam. The most effective students are not necessarily those who know the most, but those who know what they do not know. They can accurately assess which topics they have mastered and which ones need more study. This self-awareness -- knowing what you know and knowing what you don\'t know -- is metacognition.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest metacognitive technique is to ask the model to rate its confidence. This can be done with a direct prompt: "Answer the following question. Then rate your confidence from 1 to 10, where 1 means you are guessing and 10 means you are certain.' },
    { emoji: '🔍', label: 'In Detail', text: 'LLMs have a well-documented calibration problem. They generate text with uniform confidence regardless of whether the content is well-supported by training data or is a confabulation. A model will state a hallucinated fact with the same fluent, authoritative tone as a well-established one.' },
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
