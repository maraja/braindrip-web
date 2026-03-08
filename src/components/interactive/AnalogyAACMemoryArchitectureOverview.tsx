import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACMemoryArchitectureOverview() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider how human memory works when you cook a complex recipe. Your sensory memory captures the immediate input: the sound of oil sizzling, the smell of garlic. Your working memory holds the active information: "I\'m on step 4, the sauce needs to simmer for 10 more minutes, and I still need to prepare the salad.' },
    { emoji: '⚙️', label: 'How It Works', text: 'In cognitive science, sensory memory holds unprocessed perceptual input for a very brief period (milliseconds to seconds). For agents, the analog is the raw data that arrives from the environment before any processing:  The full text of a web page before extraction The complete API response including headers, metadata, and body The entire file.' },
    { emoji: '🔍', label: 'In Detail', text: '!Agent memory architecture showing sensory memory, short-term memory, and long-term memory components Source: Lilian Weng, "LLM Powered Autonomous Agents" (2023) — Memory architecture for agents mirrors cognitive science: sensory, short-term (working), and long-term memory each serve distinct roles.' },
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
