import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyRLAIF() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🤖', label: 'AI Teacher', text: 'RLHF uses human teachers to grade responses. RLAIF replaces human teachers with AI teachers. A stronger or specially prompted AI model evaluates response pairs and provides the preference labels. This dramatically scales the feedback pipeline: instead of expensive human annotators producing 1,000 comparisons per day, an AI judge can produce millions. Quality approaches RLHF when the AI judge is capable enough.' },
    { emoji: '🪞', label: 'Self-Grading', text: 'Instead of submitting your essay to a teacher (human), you grade it yourself using a rubric (AI judge with detailed criteria). RLAIF has an AI model evaluate pairs of responses, often using chain-of-thought prompting to reason about which is better. The AI-generated preferences then train a reward model or directly update the policy. This enables continuous improvement without the human bottleneck.' },
    { emoji: '🏭', label: 'Automated QA', text: 'RLHF is like hand-inspecting every product off the assembly line (expensive, slow). RLAIF is automated quality assurance: an AI system tests products at machine speed. The AI evaluator can be the same model (self-evaluation), a larger model (distillation), or a specialized judge model. The key insight: AI preferences correlate highly with human preferences for many tasks, making this scalable alternative viable.' },
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
