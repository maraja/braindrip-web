import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPInformationRetrieval() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Every time you type a question into a search engine and get back a ranked list of web pages, you are using an Information Retrieval (IR) system. Think of IR as a librarian with superhuman speed: given a query, they scan millions of books in milliseconds and hand you the most relevant ones, sorted by likely usefulness.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest retrieval model treats queries as Boolean expressions. A query like "machine learning" AND "neural networks" NOT "deep learning" returns all documents satisfying the Boolean predicate exactly. No ranking is involved -- documents either match or they don\'t.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, Information Retrieval is the task of finding material (usually documents) of an unstructured nature (usually text) that satisfies an information need from within large collections. Unlike Information Extraction (see information-extraction.md), which pulls structured facts out of documents, IR selects which documents to surface.' },
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
