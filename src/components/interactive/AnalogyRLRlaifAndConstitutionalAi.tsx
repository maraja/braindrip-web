import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLRlaifAndConstitutionalAi() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are training thousands of new employees, but instead of hiring managers to evaluate each one individually, you write a detailed code of conduct and hire a single senior employee to judge performance based on that code.' },
    { emoji: '⚙️', label: 'How It Works', text: 'CAI operates in two phases, replacing human annotation at both the SFT and RL stages:  Phase 1: Supervised Learning from AI Self-Critique  Generate responses to harmful or adversarial prompts using a helpful-only model Ask the model to critique its own response according to a principle (e.g., "Which response is more harmful?' },
    { emoji: '🔍', label: 'In Detail', text: 'Constitutional AI (CAI), introduced by Anthropic (Bai et al., 2022), and RLAIF (Reinforcement Learning from AI Feedback) follow this approach. Instead of collecting expensive human preference labels, an AI model generates preferences guided by a set of explicit principles (a "constitution").' },
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
