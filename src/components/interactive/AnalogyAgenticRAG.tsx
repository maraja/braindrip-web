import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyAgenticRAG() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🕵️', label: 'Research Detective', text: 'Basic RAG is like asking a librarian for one book. Agentic RAG is hiring a research detective: they search multiple databases, evaluate what they find, decide they need more information, refine their search queries, cross-reference sources, and keep digging until they have a complete answer. The agent dynamically decides what to retrieve, when to stop, and how to synthesize findings.' },
    { emoji: '🔄', label: 'Iterative Research', text: 'A student writing a thesis doesn\'t do one search and stop. They search, read, realize they need more context, search again with refined terms, find contradictions, verify against additional sources, and iterate until satisfied. Agentic RAG gives this iterative research capability to AI: the model plans retrieval strategies, evaluates results, and adaptively decides what else to look up.' },
    { emoji: '🧭', label: 'GPS Navigation', text: 'Basic RAG is like looking up directions once before a road trip. Agentic RAG is like GPS that continuously recalculates: "There\'s a roadblock, let me find an alternate route. Wait, the destination changed, recalculating." The agent decides on the fly which tools to use (vector search, web search, SQL query), evaluates results for relevance, and adaptively pursues the most promising information paths.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
