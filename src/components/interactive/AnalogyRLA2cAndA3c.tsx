import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLA2cAndA3c() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine training a team of scouts, each exploring a different part of an unknown territory simultaneously. Rather than sending a single scout on one long expedition, you send 16 scouts in 16 different directions. They each report back what they learned.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Each of N workers (typically 16-32) runs the following loop independently:  Sync local parameters \'   from the global network. Collect n-step trajectory (s_t, a_t, r_t, , s_&#123;t+n&#125;) using _&#123;\'&#125;.' },
    { emoji: '🔍', label: 'In Detail', text: 'A3C (Asynchronous Advantage Actor-Critic) launches multiple workers, each running its own copy of the environment and computing gradients independently. Workers asynchronously push their gradient updates to a shared parameter server, then pull the latest parameters back.' },
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
