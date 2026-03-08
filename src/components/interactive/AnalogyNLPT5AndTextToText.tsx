import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPT5AndTextToText() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a universal translator -- not just between languages, but between task formats. You speak to it in natural language ("Translate English to German: That is good."), and it responds in natural language ("Das ist gut."). Ask it to classify sentiment ("sst2 sentence: this movie is great"), and it responds with the text label ("positive").' },
    { emoji: '⚙️', label: 'How It Works', text: 'Every task is formatted with a task-specific text prefix followed by the input, and the model generates the output as text:  Even regression tasks (like semantic similarity scores) are formatted as text: the model generates the string "4.2" rather than outputting a floating-point number.' },
    { emoji: '🔍', label: 'In Detail', text: 'T5, introduced by Raffel et al. (2020) at Google, takes a deliberately unified approach: every NLP task is cast as a text-to-text problem. The model receives a text input and produces a text output. Classification becomes text generation (the model generates the label string "positive" rather than selecting class index 1).' },
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
