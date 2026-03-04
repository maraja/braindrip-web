import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyDistillationReasoning() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📝', label: 'Showing Your Work', text: 'A math teacher doesn\'t just give the answer — they show step-by-step reasoning. Distillation for reasoning trains a small model not just on the large model\'s final answers but on its chain-of-thought traces. The student learns the thinking process itself, developing reasoning abilities far beyond what it could learn from answers alone.' },
    { emoji: '🧑‍🍳', label: 'Recipe vs Taste Test', text: 'Standard distillation is like a student chef tasting a master\'s dish and trying to recreate it. Reasoning distillation gives the student the full recipe — the step-by-step reasoning process. Models like DeepSeek-R1 distill reasoning traces from larger models, teaching smaller ones to decompose problems, verify steps, and self-correct, transferring the "how to think" not just "what to output."' },
    { emoji: '🏋️', label: 'Training Program', text: 'Instead of just copying an athlete\'s performance, you copy their entire training regimen. Reasoning distillation captures the large model\'s problem-solving strategies — breaking complex tasks into substeps, checking intermediate results, exploring alternatives. The small model internalizes these patterns, becoming a much better reasoner than if it only learned from input-output pairs.' },
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
