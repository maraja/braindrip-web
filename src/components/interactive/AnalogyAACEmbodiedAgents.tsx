import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACEmbodiedAgents() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine giving an AI assistant a body. Instead of operating in the clean, discrete world of text and APIs, it must navigate a messy, continuous, physical world. It sees through cameras with limited field of view. It grips objects with imprecise manipulators.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Embodied agents perceive the world through multiple sensor modalities. Cameras (RGB, depth, stereo) provide visual information about objects, surfaces, obstacles, and the robot\'s own body. LIDAR (Light Detection And Ranging) creates precise 3D point clouds of the environment, essential for navigation and obstacle avoidance.' },
    { emoji: '🔍', label: 'In Detail', text: 'Embodied agents represent the convergence of two previously separate fields: large language models (which understand natural language instructions and can reason about tasks) and robotics (which has developed the hardware and low-level control systems for physical manipulation).' },
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
