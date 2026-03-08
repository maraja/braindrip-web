import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyADPSafetyByDesign() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider how building security works. You do not install a single lock on the front door and call it secure. Instead, you design layers: a perimeter fence, a lobby with ID badge access, locked doors on individual floors, security cameras in hallways, and a guard monitoring the feeds. Each layer stops a different class of threat.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Before designing defenses, enumerate what can go wrong. Agent-specific threats fall into five categories:  Threat modeling process:  List every tool the agent can access and classify each as read-only, write, or destructive. For each tool, enumerate the worst-case outcome if called incorrectly or maliciously.' },
    { emoji: '🔍', label: 'In Detail', text: 'Agent safety follows the same layered principle. An agent that can read files, call APIs, execute code, and send messages has a large attack surface. A single guardrail -- say, an output filter -- is insufficient. Adversarial inputs can bypass prompt-level defenses.' },
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
