import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPTextToSpeech() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine reading a bedtime story aloud. Your brain performs an intricate transformation: it parses the text to determine pronunciation (is "read" past or present tense?), decides where to place emphasis and pauses, modulates pitch to convey emotion, and orchestrates dozens of muscles to produce a continuous, expressive sound wave.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Most TTS systems decompose synthesis into three stages:  Text Analysis (Front-End): Converts raw text into a linguistic representation. This includes text normalization (expanding "Dr." to "Doctor," "$3.' },
    { emoji: '🔍', label: 'In Detail', text: 'TTS is the inverse of automatic speech recognition (see automatic-speech-recognition.md): where ASR converts sound to text, TTS converts text to sound. Modern TTS systems power voice assistants, audiobook narration, accessibility tools for the visually impaired, navigation systems, and increasingly, voice cloning and personalized digital avatars.' },
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
