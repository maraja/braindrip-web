import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEAgentSafetyRedTeaming() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine hiring a team of professional burglars to test your home security system -- not to rob you, but to find every weakness before a real criminal does. Agent safety red teaming applies the same principle to AI agent systems.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Effective agent red teams require diverse expertise. A well-composed team includes domain experts who understand the agent\'s intended use case and can craft realistic attack scenarios, security researchers who bring knowledge of system exploitation techniques and privilege escalation, creative adversarial thinkers who approach the system from.' },
    { emoji: '🔍', label: 'In Detail', text: 'Red teaming for agents is categorically different from red teaming base LLMs. A base LLM can only produce text. An agent can execute code, modify files, call APIs, send emails, and interact with production systems. When a base LLM is jailbroken, the worst case is offensive text output.' },
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
