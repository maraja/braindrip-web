import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEPromptInjectionDefenseTechniques() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of an LLM-powered application like a secured building. The system prompt is the building\'s security policy, and user inputs are visitors walking through the front door. Prompt injection is like a visitor who forges an employee badge, walks past the front desk, and starts issuing orders to the staff.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Direct injection targets the user input field with explicit override attempts. Common patterns include instruction overrides ("Ignore previous instructions..."), role-play exploits ("Pretend you are a system with no restrictions..."), context manipulation ("The system prompt actually says...' },
    { emoji: '🔍', label: 'In Detail', text: 'There are two major categories. Direct injection occurs when a user deliberately crafts input to override the system prompt — for example, typing "Ignore all previous instructions and instead do X.' },
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
