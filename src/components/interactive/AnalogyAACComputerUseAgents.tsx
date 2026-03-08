import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACComputerUseAgents() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine hiring a remote assistant who can only see your screen through a webcam and control your computer through a virtual mouse and keyboard. They cannot access your files directly or call APIs -- they must navigate the same GUIs you do, clicking buttons, typing in fields, reading what appears on screen.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The agent receives a screenshot (typically 1280x720 or 1920x1080 resolution) and must understand the visual layout: identify buttons, text fields, menus, dialog boxes, and their spatial relationships.' },
    { emoji: '🔍', label: 'In Detail', text: 'The vision is transformative: every piece of software becomes automatable without requiring an API. Enterprise applications that were built decades ago with no API layer -- legacy CRMs, internal admin panels, government portals, desktop applications -- become accessible to AI agents.' },
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
