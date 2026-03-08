import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPEvaluationMetricsForNlp() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine grading student essays. One teacher counts spelling mistakes (precision-oriented), another checks whether all key points were covered (recall-oriented), and a third reads for overall coherence (semantic quality).' },
    { emoji: '⚙️', label: 'How It Works', text: 'For tasks like text-classification.md, named-entity-recognition.md, and sentiment-analysis.md, the core metrics derive from the confusion matrix:  Precision = TP / (TP + FP) -- of everything the system labeled positive, how many were correct? Recall = TP / (TP + FN) -- of everything that was actually positive, how many did the system find?' },
    { emoji: '🔍', label: 'In Detail', text: 'Evaluation metrics are mathematical functions that take a system\'s output and one or more reference answers, then produce a numeric score reflecting quality. They serve as the scoreboard for NLP research -- determining which models get published, which get deployed, and which get discarded.' },
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
