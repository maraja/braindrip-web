import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACSemanticMemory() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of an encyclopedia versus a diary. A diary records specific experiences (episodic memory): "On Tuesday I met Dr. Smith and she told me about her new research on gene therapy.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The most structured form of semantic memory is a knowledge graph: a network of entities connected by typed relationships. Knowledge graphs enable structured queries ("What databases does Oracle own?"), traversal ("What is related to PostgreSQL?' },
    { emoji: '🔍', label: 'In Detail', text: 'For AI agents, semantic memory is the store of factual knowledge that the agent can access, query, and update during task execution. While LLMs encode vast amounts of factual knowledge in their weights, this knowledge has critical limitations: it is frozen at the training cutoff, it cannot be easily updated, it may contain errors, and it cannot.' },
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
