import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPERedTeamingPrompts() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you have just installed a new security system in your home. You could assume it works and wait for a burglar to test it, or you could hire a professional locksmith to try every door, window, and entry point, reporting what they can get through. Red-teaming is that locksmith.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A structured red-teaming exercise uses an attack taxonomy — a categorized list of known vulnerability types — as a systematic checklist. The major categories include:  Jailbreaking: Attempts to bypass the model\'s safety training or the system prompt\'s restrictions.' },
    { emoji: '🔍', label: 'In Detail', text: 'Red-teaming differs from standard testing (see prompt-testing-and-evaluation.md) in both intent and methodology. Standard testing asks "does the system work correctly on expected inputs?" Red-teaming asks "can I make the system fail on adversarial inputs?' },
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
