import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACHybridSearchStrategies() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are searching a library. Sometimes you know the exact title of a book -- you need an exact match. Sometimes you know the topic but not the specific words used -- you need conceptual matching. Sometimes you need all books by a certain author published after 2020 -- you need structured filtering.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Semantic search encodes both queries and documents into dense vector representations using embedding models (e.g., OpenAI text-embedding-3, Cohere embed-v3, or open-source models like BGE or E5).' },
    { emoji: '🔍', label: 'In Detail', text: 'Hybrid search applies this multi-strategy approach to AI agent retrieval. Semantic search using embeddings excels at finding conceptually related content even when vocabulary differs, but fails at exact matches (searching for error code "ERR_0x4F2A" via embeddings is unreliable).' },
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
