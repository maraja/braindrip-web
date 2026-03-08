import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEClassificationAndLabelingOutput() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine sorting mail into bins at a post office. Each letter arrives as unstructured content — handwritten addresses, varying formats, different sizes — but it must end up in exactly the right bin: local delivery, interstate, international, return to sender. The bins are predefined, the categories are exhaustive, and every letter must go somewhere.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The label space — the set of possible categories — is the foundation of any classification task. Two principles govern good label space design:  Exhaustiveness: Every possible input must fit into at least one category. If inputs can fall outside your defined labels, add an "Other" or "Unknown" category.' },
    { emoji: '🔍', label: 'In Detail', text: 'Classification is one of the most common and commercially valuable LLM tasks. Sentiment analysis, content moderation, support ticket routing, intent detection, document categorization — all are classification tasks at their core.' },
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
