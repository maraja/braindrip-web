import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyLLMAsJudge() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '👨‍⚖️', label: 'Peer Review', text: 'Academic papers are reviewed by other researchers, not the authors themselves. LLM-as-judge uses a strong model (like GPT-4) to evaluate the outputs of other models — rating quality, comparing responses pairwise, or scoring against rubrics. It\'s cheaper and faster than human evaluation, and surprisingly well-correlated with human judgments, though it inherits the judge model\'s own biases and blind spots.' },
    { emoji: '🏫', label: 'Teaching Assistant', text: 'A professor can\'t grade 500 essays, so TAs help. LLM-as-judge is the AI TA: given a rubric and evaluation criteria, it grades model outputs at scale. It can do reference-based judging (compare to a gold answer), reference-free judging (evaluate standalone quality), and pairwise comparison (which of two responses is better). The key limitation: the judge can be fooled by verbose, confident-sounding but incorrect responses.' },
    { emoji: '🤖', label: 'Automated Quality Control', text: 'Factories use cameras and sensors for automated quality control, reserving human inspectors for spot checks. LLM-as-judge automates the bulk of evaluation: checking factual accuracy, coherence, instruction-following, and safety at scale. Human evaluators handle edge cases, calibration, and auditing the automated system. This hybrid approach balances speed with reliability and catches cases where the AI judge is confidently wrong.' },
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
