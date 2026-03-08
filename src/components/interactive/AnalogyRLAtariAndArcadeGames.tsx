import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLAtariAndArcadeGames() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine handing someone a television showing a video game they have never seen, with no instruction manual, no explanation of the rules, and no hint about which pixels on screen matter. They can only press buttons and watch what happens to a score counter. Given enough time, most humans would figure out the game.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The experimental platform was the Arcade Learning Environment (Bellemare et al., 2013), a standardized interface to Atari 2600 game ROMs. ALE provides a uniform API: the agent receives a 210 x 160 RGB image at 60 Hz and selects from up to 18 discrete joystick actions. The reward signal is the change in game score.' },
    { emoji: '🔍', label: 'In Detail', text: 'This was the Deep Q-Network (DQN), and its publication first as a 2013 NIPS workshop paper, then as a 2015 Nature cover article, is widely regarded as the birth of modern deep reinforcement learning.' },
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
