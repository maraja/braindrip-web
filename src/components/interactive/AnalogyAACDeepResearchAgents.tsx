import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACDeepResearchAgents() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a research assistant who, given a question like "What are the economic impacts of universal basic income?", does not just return the first Google result. Instead, they search academic databases, read 30 papers, extract key findings, notice contradictions between studies, search for more sources to resolve those contradictions, organize the.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The core algorithm: (1) Decompose the question into sub-questions ("What are the economic impacts of UBI?" becomes: "What do RCTs show about employment effects?", "What are the fiscal costs?", "How does it affect entrepreneurship?"). (2) Search for each sub-question across multiple sources (web search, academic databases, news archives).' },
    { emoji: '🔍', label: 'In Detail', text: 'The fundamental difference between a deep research agent and a simple RAG system is iteration. RAG performs one retrieval pass: query the knowledge base, get relevant chunks, generate a response. A deep research agent performs many passes: the initial search reveals that Study A claims UBI reduces poverty by 30%, but Study B shows no effect.' },
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
