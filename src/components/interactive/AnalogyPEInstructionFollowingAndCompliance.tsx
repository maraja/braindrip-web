import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEInstructionFollowingAndCompliance() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think about why some road signs are obeyed and others ignored. A bright red stop sign at an intersection gets near-universal compliance. A small "speed limit 25" sign half-hidden by a tree branch gets far less. The difference is not about the importance of the rule -- it is about the sign\'s visibility, clarity, and the driver\'s expectations.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Salience is how "loud" an instruction is in the model\'s attention landscape. High-salience instructions stand out from surrounding text and are more likely to be attended to. Factors that increase salience include: uppercase or bold formatting ("IMPORTANT:"), position at the beginning or end of the prompt (primacy/recency effects), separation from.' },
    { emoji: '🔍', label: 'In Detail', text: 'Instruction following is the foundational capability that makes LLM applications possible. Every prompt, system instruction, and constraint relies on the model\'s ability to receive an instruction, understand it, and generate output that adheres to it. When instruction following is reliable, applications behave predictably.' },
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
