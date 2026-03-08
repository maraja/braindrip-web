import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE04Deberta() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine reading the sentence "The bank approved the loan." To understand "bank," you need two kinds of information: what the word means (its content — a financial institution, not a riverbank) and where it sits in the sentence (its position — the subject, before the verb).' },
    { emoji: '⚙️', label: 'How It Works', text: 'In standard Transformers (BERT, RoBERTa), each token is represented by a single vector that combines content and position: H_i = ContentEmbed(token_i) + PositionEmbed(i). All attention computations use this combined representation, making it impossible to isolate how much of the attention weight is driven by what a token means versus where it.' },
    { emoji: '🔍', label: 'In Detail', text: 'DeBERTa separates them. Each token carries two distinct vectors throughout the network: a content embedding and a position embedding. Attention is computed between these representations independently — content attends to content, content attends to position, and position attends to content.' },
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
