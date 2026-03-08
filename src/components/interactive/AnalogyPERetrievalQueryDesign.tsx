import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPERetrievalQueryDesign() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of retrieval query design like asking a librarian the right question. If you walk into a library and say "I\'m confused about taxes," the librarian cannot help you very well. But if you say "I need the IRS guidelines for deducting home office expenses for self-employed individuals in 2024," the librarian knows exactly where to look.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Query rewriting transforms the user\'s raw input into a more effective retrieval query. This can be done with simple rules or by prompting the LLM itself:  Expansion: Add synonyms, expand acronyms, and include domain context. "K8s OOM issues" becomes "Kubernetes out-of-memory errors container memory limits pod eviction.' },
    { emoji: '🔍', label: 'In Detail', text: 'In a RAG system, the user\'s natural language question is converted into a vector (via embedding) or keyword query (via BM25) and matched against a document index. The fundamental problem is that user questions and document passages are written in very different styles. Users ask "Why is my app crashing?' },
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
