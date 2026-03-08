import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE07Claude1And2() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two competing airlines. One obsesses over speed — getting passengers to their destination as fast as possible, accepting turbulence and tight margins. The other obsesses over safety — not because it does not care about speed, but because it believes that the passengers who trust the safest airline will fly with them for decades.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Claude was the first commercial deployment of Constitutional AI (CAI), Anthropic\'s alignment methodology. Rather than relying solely on human preference ratings (as in OpenAI\'s RLHF approach), CAI trains the model to evaluate its own outputs against a set of explicit principles — a "constitution."  The training process has two phases.' },
    { emoji: '🔍', label: 'In Detail', text: 'Anthropic, the company behind Claude, took the second approach to AI. In a year when every lab raced to match ChatGPT\'s viral success, Anthropic built its brand on the premise that how you build AI matters as much as what it can do.' },
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
