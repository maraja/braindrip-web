import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyEvaluationMetrics() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🌡️', label: 'Medical Dashboard', text: 'A doctor doesn\'t rely on a single vital sign — they check temperature, blood pressure, heart rate, and oxygen levels together. Evaluation metrics are the vital signs of an LLM: accuracy measures correctness, BLEU/ROUGE measure text overlap with references, F1 measures precision-recall balance, and human ratings capture subjective quality. No single metric tells the full story; you need the full dashboard.' },
    { emoji: '📊', label: 'Report Card', text: 'A student gets grades in multiple subjects, not just one overall score. Evaluation metrics are like grades for different dimensions: factual accuracy (science), fluency (English), reasoning (math), helpfulness (participation), and safety (conduct). A model might ace fluency but fail accuracy — just like a student who writes beautifully but gets the facts wrong. The report card reveals the full profile.' },
    { emoji: '🔍', label: 'Quality Inspection', text: 'A factory inspects products on multiple dimensions: durability, weight, color accuracy, safety compliance. LLM evaluation does the same: BLEU checks n-gram overlap, METEOR considers synonyms, BERTScore uses semantic similarity, and human judges rate coherence and helpfulness. Each metric catches different defects — a model might score high on BLEU by copying phrases but low on human ratings for being incoherent.' },
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
