import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE03AiSafetyAndGovernance() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a new technology that can write convincing text, generate realistic images, write functional code, and increasingly act autonomously in the world. It is adopted by hundreds of millions of people in under two years. It is deployed in healthcare, education, finance, law, and defense.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The EU AI Act (2024) was the world\'s first comprehensive AI legislation. It classifies AI systems by risk level: unacceptable (banned outright: social scoring, real-time facial recognition in public spaces), high-risk (subject to conformity assessments: healthcare, education, employment), and limited/minimal risk (transparency requirements only).' },
    { emoji: '🔍', label: 'In Detail', text: 'This is not a hypothetical — it is the reality that AI safety and governance frameworks have been racing to address since ChatGPT\'s launch in November 2022. The challenge is unique in the history of technology regulation: the capability is advancing faster than understanding, the risks span from mundane (bias, errors) to existential (autonomous.' },
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
