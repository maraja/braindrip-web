import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACAutonomySpectrum() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider the spectrum of driving assistance in cars. At one end, cruise control maintains your speed but you steer, brake, and navigate. Then there is lane-keeping assist, which nudges the wheel but you remain in control. Next, highway autopilot handles steering, acceleration, and braking on highways, but you must monitor and intervene.' },
    { emoji: '⚙️', label: 'How It Works', text: 'At the copilot level, the human is firmly in control of the workflow. The AI provides suggestions, completions, and information on demand, but the human makes every decision and performs every action. Characteristics: AI responds only when prompted or triggered by human action.' },
    { emoji: '🔍', label: 'In Detail', text: 'The autonomy spectrum describes the continuum of how much independent decision-making and action-taking an AI system performs relative to its human operator. This is not a binary — agents are not simply "autonomous" or "not autonomous.' },
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
