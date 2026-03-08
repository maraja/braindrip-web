import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEDynamicSystemPrompts() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a modern smart TV that adjusts its settings based on who is watching. When a child logs in, parental controls activate, the interface simplifies, and educational content is prioritized. When an adult logs in, the full content library unlocks, advanced settings appear, and recommendations shift.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The most common architecture uses a template with placeholder slots that are filled at runtime. A template might look like:  Each block is a self-contained module maintained independently. At runtime, the application selects the appropriate version of each block based on context and assembles them into a complete system prompt.' },
    { emoji: '🔍', label: 'In Detail', text: 'Static system prompts treat every user and situation identically. This works for simple applications but fails at scale. A customer service application needs different instructions for free-tier users versus enterprise customers. A coding assistant needs different constraints for junior developers versus senior architects.' },
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
