import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPDocumentEmbeddings() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a librarian who can instantly judge how similar two books are by their content -- not just their titles or keywords, but their deeper themes and arguments. A document embedding gives a machine this capability by compressing an entire document (hundreds or thousands of words) into a single fixed-length vector, typically 128-1024 dimensions.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The classic approach constructs a TF-IDF-weighted document-term matrix and then applies truncated Singular Value Decomposition (SVD) to reduce dimensionality:  This is Latent Semantic Analysis (LSA). The SVD discovers latent "concepts" that group co-occurring terms.' },
    { emoji: '🔍', label: 'In Detail', text: 'The challenge is greater than for sentences: documents are longer (often exceeding model context windows), contain multiple topics, and require representations that capture both local detail and global structure.' },
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
