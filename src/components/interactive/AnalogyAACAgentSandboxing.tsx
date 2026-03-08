import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACAgentSandboxing() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine giving a toddler access to a full kitchen -- knives, gas stove, cleaning chemicals, and all. No responsible parent would do this. Instead, you might set up a play kitchen where they can practice cooking with safe materials. If they make a mess, the damage is contained.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The primary sandboxing mechanism is containerization. Docker containers provide process isolation, filesystem isolation, and network namespace separation from the host. Firecracker microVMs go further, providing hardware-level isolation with a minimal virtual machine that boots in under 125ms.' },
    { emoji: '🔍', label: 'In Detail', text: 'An AI agent with code execution capabilities, file system access, or network access is powerful but dangerous. A coding agent might accidentally execute rm -rf / instead of cleaning up a temporary directory. A web-browsing agent might make unauthorized API calls or access malicious websites.' },
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
