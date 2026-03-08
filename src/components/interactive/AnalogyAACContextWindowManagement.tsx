import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACContextWindowManagement() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine packing for a trip with a strict carry-on limit. You have clothes, toiletries, electronics, documents, and snacks -- far more than fits in one bag. You must prioritize: passport and wallet are non-negotiable, a change of clothes is essential, the third novel is nice-to-have. Context window management is this same packing problem for LLMs.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Not all context is equally important. A practical priority hierarchy: (1) System prompt with agent identity, capabilities, and constraints -- always included. (2) Current task description and goals -- always included.' },
    { emoji: '🔍', label: 'In Detail', text: 'The challenge is acute for agents because they accumulate context over time. A simple chatbot processes one user message and one response. An agent running a 30-step task accumulates 30 rounds of thought-action-observation, each potentially thousands of tokens. By step 20, the raw accumulated context might exceed 100K tokens.' },
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
