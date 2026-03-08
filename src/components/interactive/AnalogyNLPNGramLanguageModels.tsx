import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPNGramLanguageModels() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are texting and your phone suggests the next word. If you have typed "New York," it might suggest "City" or "Times." The phone is not understanding language -- it is recalling which words have historically followed "New York" in a large corpus of text.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The probability of a word given its context is estimated by counting:  For example, if "New York" appears 5,000 times in a corpus and "New York City" appears 2,000 times, then P("City" | "New York") = 2000/5000 = 0.4.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, a language model assigns a probability P(w_1, w_2, ..., w_m) to a sequence of words. By the chain rule, this factors into:' },
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
