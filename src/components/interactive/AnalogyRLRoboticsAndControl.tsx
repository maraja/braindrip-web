import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLRoboticsAndControl() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine learning to ride a bicycle by reading a physics textbook. You understand the equations of balance, torque, and friction -- but the first time you sit on a real bike, you fall over. The gap between theoretical knowledge and physical execution is enormous.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Training RL policies requires millions of environment interactions. DQN needed 50 million frames for Atari (atari-and-arcade-games.md); a physical robot operating at 10 Hz would need ~58 days of continuous operation for the equivalent, with no resets, no parallelism, and no room for destructive exploration.' },
    { emoji: '🔍', label: 'In Detail', text: 'RL for robotics applies sequential decision-making to physical embodied agents: robotic arms manipulating objects, legged robots walking over terrain, drones navigating obstacles, and autonomous vehicles making split-second decisions. Unlike Atari or Go, a failed action here can break hardware worth hundreds of thousands of dollars.' },
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
