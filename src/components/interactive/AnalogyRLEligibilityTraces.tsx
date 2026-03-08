import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLEligibilityTraces() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you\'re training a dog. The dog performs a sequence of tricks -- sit, shake, roll over -- and you give it a treat at the end. Which trick earned the treat? The most recent one (roll over) deserves the most credit, but the earlier ones contributed too.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The -return is a weighted average of all n-step returns:  [equation]  where G_t^&#123;(n)&#125; = R_&#123;t+1&#125; +  R_&#123;t+2&#125; +  + ^&#123;n-1&#125; R_&#123;t+n&#125; + ^n V(S_&#123;t+n&#125;) is the n-step return. The geometric weighting (1 - )^&#123;n-1&#125; sums to 1, creating a valid average.' },
    { emoji: '🔍', label: 'In Detail', text: 'Eligibility traces implement exactly this idea in RL. They maintain a decaying memory of which states were recently visited, so when a reward signal arrives (via the TD error), credit is distributed backward to all recently visited states -- not just the immediately preceding one.' },
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
