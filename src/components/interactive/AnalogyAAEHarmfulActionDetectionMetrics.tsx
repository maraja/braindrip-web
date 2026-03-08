import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEHarmfulActionDetectionMetrics() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a security camera system in a warehouse. It needs to distinguish between an employee moving inventory (normal), an employee accessing a restricted area without authorization (potentially harmful), and someone actively stealing merchandise (clearly harmful).' },
    { emoji: '⚙️', label: 'How It Works', text: 'A structured taxonomy organizes agent actions by harm severity, enabling consistent classification and appropriate response. Benign actions are normal operations within the agent\'s task scope. Reading a source file to understand code, creating a temporary file for intermediate computation, calling an API with appropriate parameters.' },
    { emoji: '🔍', label: 'In Detail', text: 'Harmful action detection for agents faces the same fundamental challenge. Agents take hundreds or thousands of actions during task execution -- reading files, calling APIs, writing code, sending messages. Most actions are benign. A small fraction may be harmful.' },
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
