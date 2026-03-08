import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLRlhfPipeline() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine training a new employee. First, you give them a manual and have them practice standard procedures (supervised fine-tuning). Then, you have experienced managers evaluate pairs of their work samples and say which is better (reward modeling).' },
    { emoji: '⚙️', label: 'How It Works', text: 'The pretrained language model _&#123;pretrain&#125; is fine-tuned on high-quality demonstration data -- typically prompt-response pairs written by human annotators:  [equation]  This produces _&#123;SFT&#125;, which can follow instructions but lacks nuance in quality. InstructGPT used roughly 13,000 demonstration examples for this stage.' },
    { emoji: '🔍', label: 'In Detail', text: 'Reinforcement Learning from Human Feedback (RLHF) is this three-stage pipeline applied to language models. A pretrained LLM first learns to follow instructions through supervised fine-tuning (SFT), then a reward model learns to predict human preferences from pairwise comparisons, and finally PPO optimizes the language model\'s policy against this.' },
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
