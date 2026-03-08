import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE02Gpt1() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a student who spends months reading thousands of books — fiction, textbooks, newspapers, manuals — with no teacher, no tests, no guidance. Then, when given a specific exam (sentiment analysis, question answering, textual entailment), the student only needs a brief study session to excel, because they\'ve already absorbed the patterns and.' },
    { emoji: '⚙️', label: 'How It Works', text: 'GPT-1 used a 12-layer Transformer decoder with 12 attention heads and an embedding dimension of 768, totaling approximately 117 million parameters. Unlike the original Transformer (01-attention-is-all-you-need.md), GPT-1 dropped the encoder entirely. There was no cross-attention — only masked self-attention within the decoder.' },
    { emoji: '🔍', label: 'In Detail', text: 'In June 2018, Alec Radford, Karthik Narasimhan, Tim Salimans, and Ilya Sutskever at OpenAI published "Improving Language Understanding by Generative Pre-Training." The timing was significant: 05-elmo-and-contextual-embeddings.md (February 2018) and 06-ulmfit-and-transfer-learning.' },
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
