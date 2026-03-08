import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPAttentionMechanism() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are translating a long paragraph from French to English. Instead of reading the entire French paragraph, forming a single mental summary, and then writing the English version from memory (the basic seq2seq approach), you keep the French text open on your desk.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given encoder hidden states (h_1, h_2, ..., h_S) and the current decoder state s_t, attention computes:  Alignment scores: e_&#123;t,j&#125; = score(s_t, h_j) for each source position j. Attention weights: alpha_&#123;t,j&#125; = softmax(e_&#123;t,j&#125;) = exp(e_&#123;t,j&#125;) / sum_k exp(e_&#123;t,k&#125;). Context vector: c_t = sum_&#123;j=1&#125;^&#123;S&#125; alpha_&#123;t,j&#125; * h_j.' },
    { emoji: '🔍', label: 'In Detail', text: 'In the context of sequence-to-sequence-models.md, the attention mechanism was introduced by Bahdanau et al. (2014) to solve the bottleneck problem: compressing an entire source sequence into a single fixed-size context vector loses information, especially for long sequences.' },
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
