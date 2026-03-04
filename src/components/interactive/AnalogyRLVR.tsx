import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyRLVR() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '✅', label: 'Auto-Graded Tests', text: 'RLVR (RL with Verifiable Rewards) is like learning from auto-graded tests: math problems with known answers, code with test suites, logic puzzles with provable solutions. Instead of a subjective reward model (which can be gamed), the reward is binary and objective: "Did your answer match the ground truth?" This eliminates reward hacking because the signal is incorruptible — the answer is either right or wrong.' },
    { emoji: '🎯', label: 'Target Practice', text: 'In target practice, the score is objective — you either hit the bullseye or you did not. RLVR trains models using objective, verifiable rewards: correct math answers, passing code tests, valid proofs. DeepSeek-R1 demonstrated that pure RLVR on math and code problems produces emergent chain-of-thought reasoning, self-verification, and even "aha moment" behaviors without any human preference data.' },
    { emoji: '🧪', label: 'Lab Experiments', text: 'In science, you know an experiment worked when it produces the predicted result — no subjective judgment needed. RLVR applies this to LLM training: rewards come from verifiable outcomes (correct answers, passing tests, valid proofs). This is the purest form of RL for LLMs: no reward model bias, no human annotation noise. The challenge is that only certain domains (math, code, formal logic) have easily verifiable answers.' },
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
