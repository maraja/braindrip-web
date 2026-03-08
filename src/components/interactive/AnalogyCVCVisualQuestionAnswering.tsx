import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCVisualQuestionAnswering() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of VQA as an open-book exam where the textbook is a photograph. A student (the model) sees an image and reads a question about it -- "How many people are wearing hats?" or "What color is the car on the left?" -- and must produce the correct answer.' },
    { emoji: '⚙️', label: 'How It Works', text: 'VQA has been approached in three main ways:  Classification over a fixed answer set: Treat VQA as selecting from the top 3,129 most frequent answers in the training set. Simple but limited. Generative (open-ended): Generate the answer token by token, allowing arbitrary responses.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, VQA maps an image x and a question q = (q_1, , q_L) to an answer a:' },
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
