import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACDynamicRetrievalDecisions() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of how you decide whether to Google something. If someone asks your birthday, you just answer. If someone asks the GDP of Turkmenistan, you search. If someone asks a question you half-remember, you might try to answer first and then verify.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The agent evaluates incoming queries through a series of gates. First: is this a factual question or an opinion/creative task? Creative tasks rarely benefit from retrieval.' },
    { emoji: '🔍', label: 'In Detail', text: 'Dynamic retrieval decisions apply this same judgment to AI agents. Instead of retrieving for every single query (expensive and sometimes counterproductive) or never retrieving (missing critical information), the agent evaluates each query in real time and decides the appropriate retrieval strategy.' },
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
