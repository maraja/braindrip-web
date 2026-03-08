import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEMultiTurnInstructionPersistence() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a factory floor where safety rules are posted on a sign at the entrance. On the first day, every worker reads the sign carefully and follows every rule. By the second week, some rules start to slip. By the end of the month, the sign is background noise -- visible but no longer actively attended to.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Instruction adherence follows a characteristic decay pattern. For the first 5-10 turns, compliance is high (85-95% of instructions followed). Between turns 10-20, a gradual decline begins, with stylistic and tone instructions degrading first.' },
    { emoji: '🔍', label: 'In Detail', text: 'This phenomenon is a direct consequence of how transformer attention mechanisms work. The system prompt tokens are at the very beginning of the context window. As conversation turns accumulate, the distance between the system prompt and the model\'s current generation point grows.' },
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
