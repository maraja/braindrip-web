import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyHumanEvaluation() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🍷', label: 'Wine Tasting Panel', text: 'Automated metrics are like chemical analysis of wine — they measure sugar, acidity, and alcohol content. Human evaluation is the tasting panel — trained experts assessing aroma, complexity, balance, and overall experience. Some qualities (helpfulness, naturalness, nuance) can only be meaningfully judged by humans. Human evaluation captures what automated metrics miss, but it\'s expensive, slow, and subjective.' },
    { emoji: '⚖️', label: 'Jury Trial', text: 'Legal cases could theoretically be decided by algorithms, but we use human juries because judgment requires nuance, context, and values. Human evaluation of LLMs serves the same purpose: real people rate outputs for helpfulness, accuracy, harmlessness, and overall quality. The challenge is inter-annotator agreement — different "jurors" may disagree, so careful guidelines and multiple evaluators are essential.' },
    { emoji: '🎨', label: 'Art Critique', text: 'You can measure a painting\'s pixel count, color distribution, and symmetry automatically — but only a human can evaluate whether it\'s beautiful, meaningful, or evocative. Human evaluation rates the qualities that matter most to users but resist quantification: Was the response actually helpful? Did it understand the nuance of the question? Was the tone appropriate? These subjective judgments remain the gold standard for LLM quality.' },
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
