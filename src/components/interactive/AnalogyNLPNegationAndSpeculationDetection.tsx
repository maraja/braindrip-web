import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPNegationAndSpeculationDetection() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider two medical records: "The patient has pneumonia" and "The patient does not have pneumonia." These sentences differ by only two words, yet their clinical meaning is diametrically opposite. A naive information extraction system that matches "patient" + "has" + "pneumonia" would mark both as positive findings.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Negation cues are the linguistic triggers that reverse the polarity of a statement. They come in several forms:  Adverbs and particles: not, never, no, neither, nor, nowhere Prefixes: un-, in-/im-/ir-, dis-, non-, a- (e.g.' },
    { emoji: '🔍', label: 'In Detail', text: 'Think of it like reading a detective novel. The detective says: "The butler committed the murder" (assertion). "The butler did not commit the murder" (negation). "The butler might have committed the murder" (speculation). Each statement has dramatically different implications for the investigation.' },
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
