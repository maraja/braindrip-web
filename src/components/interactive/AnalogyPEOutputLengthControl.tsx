import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEOutputLengthControl() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider the difference between a tweet and a blog post. Twitter\'s 280-character limit forces you to distill your message to its essence — every word must earn its place. A blog post lets you elaborate, provide context, and explore nuances. Both formats communicate, but the constraint fundamentally shapes the content.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The most effective length control uses concrete, measurable targets. "Respond in exactly 3 sentences" works far better than "be brief." Specific patterns that produce reliable results include:  Sentence count: "Answer in 2-3 sentences." Word count: "Keep your response under 100 words." Paragraph count: "Write exactly 2 paragraphs.' },
    { emoji: '🔍', label: 'In Detail', text: 'LLMs are inherently biased toward verbosity. This is not a bug — it is a direct consequence of how they are trained. During reinforcement learning from human feedback (RLHF), human raters consistently prefer longer, more detailed responses because they appear more helpful and thorough.' },
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
