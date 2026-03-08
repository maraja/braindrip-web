import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACLongTermPersistentMemory() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a researcher who keeps a meticulously organized filing cabinet. After each day of research, they file away their notes under categorized folders: "Methodology papers," "Experimental results," "Key contacts," "Open questions." Weeks later, when they need to recall a specific finding, they know exactly which folder to search.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The most common implementation of long-term memory for agents uses vector embeddings:  Encoding: Text (conversation turns, facts, observations) is converted to dense vector embeddings using an embedding model (OpenAI\'s text-embedding-3-large, Cohere\'s embed-v3, or open-source alternatives like E5, BGE) Storage: Embeddings are stored in a vector.' },
    { emoji: '🔍', label: 'In Detail', text: 'For AI agents, long-term persistent memory is any storage mechanism that retains information beyond the current context window and across separate sessions. Without it, every conversation starts from scratch: the agent has no memory of past interactions, learned preferences, accumulated knowledge, or prior task outcomes.' },
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
