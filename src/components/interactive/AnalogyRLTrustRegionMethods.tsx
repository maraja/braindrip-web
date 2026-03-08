import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLTrustRegionMethods() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine tuning a guitar string. Small, careful turns of the tuning peg make the pitch better. But if you wrench the peg too far in one motion, the string snaps -- catastrophic failure from an over-aggressive update.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Kakade & Langford (2002) established that the performance difference between two policies  and &#123;&#125; can be expressed exactly as:  [equation]  where d^&#123;&#123;&#125;&#125; is the state visitation distribution under the new policy &#123;&#125;. The problem is that we cannot sample from d^&#123;&#123;&#125;&#125; before actually deploying &#123;&#125;.' },
    { emoji: '🔍', label: 'In Detail', text: 'In policy optimization, the vanilla policy gradient gives a direction of improvement, but says nothing about how far to step. A step that is too large can move the policy into a region where the gradient approximation is wildly inaccurate, causing performance to collapse.' },
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
