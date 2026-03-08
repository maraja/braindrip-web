import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAESampleSizeAndPowerAnalysis() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you flip a coin 3 times and get 2 heads. Would you conclude the coin is biased? Probably not -- 3 flips is far too few to distinguish bias from luck. Agent evaluation faces the same problem: running an agent on 10 tasks and observing a 70% success rate tells you almost nothing about its true capability.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Most agent evaluations produce binary outcomes: the agent either completed the task or it didn\'t. Comparing two agents\' success rates is a two-proportion z-test. The required sample size per group is:  [equation]  where &#123;p&#125; = (p_1 + p_2)/2, z_&#123;/2&#125;  1.96 for  = 0.05, and z_&#123;&#125;  0.84 for 80% power.' },
    { emoji: '🔍', label: 'In Detail', text: 'Power analysis quantifies the relationship between four interconnected quantities: sample size (n), effect size (the difference you want to detect), significance level (, your false positive tolerance), and statistical power (1 - , your probability of detecting a real effect). Fix any three, and the fourth is determined.' },
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
