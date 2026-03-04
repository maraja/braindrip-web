import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogySFT() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🎓', label: 'Apprenticeship', text: 'A pre-trained model is like a well-read person who has never had a job. SFT is the apprenticeship: you show them examples of ideal work — "When asked X, respond like Y." The model learns the format, tone, and style of being a helpful assistant. It is not learning new knowledge but learning how to apply what it already knows in the right format and manner.' },
    { emoji: '🎭', label: 'Acting Lessons', text: 'The base model knows everything about being an assistant from reading the internet, but it does not know it should act as one. SFT is acting lessons: "Here is a script of how a helpful assistant responds." Through thousands of demonstration examples (instruction-response pairs), the model learns to stay in character — answering questions, following instructions, and being conversational rather than continuing web text.' },
    { emoji: '🔧', label: 'Tool Calibration', text: 'A powerful microscope (pre-trained model) fresh from the factory needs calibration before a scientist can use it. SFT is that calibration: aligning the instrument to its intended use case. The demonstrations show the model exactly what inputs look like (user instructions) and what good outputs look like (helpful responses). Usually just 10k-100k high-quality examples are needed to transform a base model into a chatbot.' },
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
