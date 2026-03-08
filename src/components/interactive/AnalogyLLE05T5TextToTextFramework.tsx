import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE05T5TextToTextFramework() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a universal translator — not just between languages, but between any form of text input and text output. You ask it to translate, it translates. You ask it to summarize, it summarizes. You ask it to classify sentiment, it outputs "positive" or "negative" as text. You ask it a question, it answers in text.' },
    { emoji: '⚙️', label: 'How It Works', text: 'T5 converts every task into the same format by prepending a task-specific prefix:  Translation: "translate English to German: That is good." → "Das ist gut." Summarization: "summarize: [article text]" → "[summary text]" Classification: "cola sentence: The course is jumping well.' },
    { emoji: '🔍', label: 'In Detail', text: 'This was the elegant insight behind T5, the Text-to-Text Transfer Transformer. Published by Colin Raffel and colleagues at Google Research in October 2019, the paper had a deliberate subtitle: "Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer." This was not just another model release.' },
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
