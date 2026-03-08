import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPTransferLearningInNlp() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine learning to play the piano before taking up the guitar. You do not start from zero -- your understanding of melody, rhythm, chord progressions, and finger coordination all transfer to the new instrument.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Era 1: Feature Engineering (pre-2013). Practitioners hand-crafted features -- POS tags, dependency parse paths, gazetteer lookups, n-gram patterns -- and fed them to classifiers like SVMs or logistic regression. Each new task required domain expertise to design effective features.' },
    { emoji: '🔍', label: 'In Detail', text: 'More formally, transfer learning involves training a model on a source task (typically language modeling on a large corpus) and then adapting the learned representations to a target task (e.g., classification, NER, or QA).' },
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
