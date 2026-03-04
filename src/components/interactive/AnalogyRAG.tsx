import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyRAG() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📚', label: 'Open-Book Exam', text: 'Without RAG, an LLM takes a closed-book exam — it can only use what it memorized during training. RAG turns it into an open-book exam: before answering, the model searches a knowledge base, retrieves relevant passages, and uses them as reference material. This grounds responses in actual documents, reducing hallucination and enabling answers about private or recent data.' },
    { emoji: '🔍', label: 'Research Librarian', text: 'RAG is like having a research librarian who, when you ask a question, first goes to the stacks, pulls the most relevant books and papers, then writes you an informed answer citing those sources. The "retrieve" step finds relevant documents via embeddings; the "generate" step synthesizes them into a coherent response. The model brings language skills; the retriever brings knowledge.' },
    { emoji: '🧠', label: 'Brain + Filing Cabinet', text: 'The LLM is the brain (reasoning and language) and the vector database is the filing cabinet (stored knowledge). RAG connects them: the brain formulates a search query, the filing cabinet returns relevant documents, and the brain reads them to formulate an answer. This separation means you can update knowledge by adding files to the cabinet without retraining the brain.' },
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
