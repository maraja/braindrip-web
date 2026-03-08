import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPERagPromptDesign() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of RAG prompt design like writing a research paper with specific source materials laid out in front of you. You have the assignment (the user query), the sources (retrieved documents), and the writing rules (formatting, citation requirements, staying faithful to sources).' },
    { emoji: '⚙️', label: 'How It Works', text: 'There are two primary patterns for positioning retrieved documents relative to the user query:  Context-before-query (most common): Place retrieved documents first, followed by the user question. This works well because the model processes context before encountering the question, allowing it to "read" the sources before formulating an answer.' },
    { emoji: '🔍', label: 'In Detail', text: 'RAG prompt design is the discipline of structuring the prompt template that combines retrieved context, user queries, and instructions into a coherent input for the language model.' },
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
