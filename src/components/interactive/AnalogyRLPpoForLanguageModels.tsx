import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLPpoForLanguageModels() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine PPO was originally designed to teach a robot to walk -- it takes a step, observes the ground, decides on the next movement, and gets continuous feedback about balance and forward progress.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The text generation process is cast as an MDP:  State s_t: The prompt x concatenated with all tokens generated so far (y_1, , y_&#123;t-1&#125;) Action a_t: The next token y_t selected from vocabulary &#123;V&#125; (typically   32&#123;,&#125;000--128&#123;,&#125;000) Transition: Deterministic -- appending the chosen token to the sequence Reward: r_t = 0 for t &lt; T, and r_T = r_(x,.' },
    { emoji: '🔍', label: 'In Detail', text: 'In the language model setting, PPO optimizes an autoregressive policy _ (the LLM) that generates text token by token. Each token selection is an action, the growing sequence is the state, and the reward comes only after the full response is generated.' },
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
