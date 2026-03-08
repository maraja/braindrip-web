import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyADPContextAndStateStrategy() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine packing a suitcase with a strict weight limit. You cannot take everything you own. You must decide what is essential (passport, medication), what is important (a few outfits, charger), and what is nice-to-have (extra shoes, books). You pack essentials first, then important items, then fill remaining space with nice-to-haves.' },
    { emoji: '⚙️', label: 'How It Works', text: 'For a 128K-token context window, allocate zones with clear budgets:  Enforcement: Monitor token usage per zone after each turn. When a zone exceeds its budget, apply that zone\'s compression strategy (see below). Do not let one zone cannibalize another --- a single large tool result should not push conversation history out of the window.' },
    { emoji: '🔍', label: 'In Detail', text: 'An agent\'s context window is that suitcase. It has a fixed capacity (4K to 200K tokens depending on the model), and everything the agent needs to think --- the system prompt, conversation history, tool results, and working memory --- must fit inside it. When it fills up, you must remove something to add something new.' },
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
