import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPTopicModeling() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine browsing a library with no catalog. You open books at random, notice clusters of co-occurring words -- "election," "vote," "candidate" in one cluster; "protein," "cell," "genome" in another -- and gradually infer the library\'s subject categories.' },
    { emoji: '⚙️', label: 'How It Works', text: 'LSA (Deerwester et al., 1990) applies Truncated Singular Value Decomposition (SVD) to the term-document matrix. Given a term-document matrix X of size  x N (vocabulary by documents), SVD decomposes it as:  Where U_k ( x k) contains term-topic associations, S_k (k x k) holds singular values capturing topic importance, and V_k (N x k) contains.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, a topic model is a generative statistical model that explains a corpus as a mixture of latent topics, where each topic is a probability distribution over words and each document is a mixture of topics. If a corpus has K topics, then topic k is characterized by a distribution phi_k over the vocabulary (e.g.' },
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
