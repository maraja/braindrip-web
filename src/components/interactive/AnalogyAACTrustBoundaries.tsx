import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACTrustBoundaries() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a corporate executive receiving information from different sources throughout the day. A message from their CFO about quarterly numbers carries high trust -- they act on it immediately. An email from a known client carries medium trust -- they verify key details before acting.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Every data source entering the agent system is assigned a trust level. The standard hierarchy, from highest to lowest trust, is:  System instructions (highest): Developer-written prompts that define the agent\'s identity, capabilities, constraints, and safety rules. These are static and reviewed.' },
    { emoji: '🔍', label: 'In Detail', text: 'In an AI agent system, information flows in from many sources: system instructions written by the developer, user messages, retrieved documents from a knowledge base, web pages the agent browses, tool outputs from APIs, and data from other agents.' },
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
