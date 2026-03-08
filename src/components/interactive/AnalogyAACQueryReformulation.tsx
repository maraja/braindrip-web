import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACQueryReformulation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine asking a librarian for "that book about the thing with the boats from the war." A good librarian does not search the catalog with your exact words. They mentally reformulate your vague request into something more precise: perhaps "naval warfare World War II" or "Pacific theater battleships history.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Query expansion enriches the original query with related terms, synonyms, and contextual keywords. An LLM can generate expanded queries by reasoning about what terms relevant documents would likely contain. For example, "LLM memory" might expand to "large language model memory management context window conversation history state persistence.' },
    { emoji: '🔍', label: 'In Detail', text: 'When a user asks a question, their phrasing is optimized for human communication, not for search systems. The vocabulary mismatch between how people ask questions and how information is stored in retrieval systems is a fundamental challenge. "Why is my code slow?' },
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
