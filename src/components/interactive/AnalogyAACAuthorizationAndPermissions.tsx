import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACAuthorizationAndPermissions() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine hiring a contractor to renovate your kitchen. You give them a key to your house, but only during working hours. They can access the kitchen, the garage (for tools), and the bathroom. They cannot enter your bedroom, your home office, or your safe.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Rather than binary access (full access or none), permissions are scoped to specific resources and operations. OAuth 2.0 scopes provide a natural model: read:files, write:files, delete:files are separate permissions that can be granted independently. An agent that summarizes documents needs read:files but not write:files or delete:files.' },
    { emoji: '🔍', label: 'In Detail', text: 'When an AI agent connects to external systems -- databases, APIs, file systems, communication tools -- it needs credentials and permissions. The critical question is: how much access should the agent have? The temptation is to give the agent admin-level access to everything, because that avoids permission errors and makes development easier.' },
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
