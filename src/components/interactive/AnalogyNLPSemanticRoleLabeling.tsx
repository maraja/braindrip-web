import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPSemanticRoleLabeling() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine reading a news headline and mentally answering: Who performed the action? What was the action? Who or what was affected? Where and when did it happen? SRL automates this process.' },
    { emoji: '⚙️', label: 'How It Works', text: 'PropBank (Palmer et al., 2005) defines roles relative to each verb\'s specific usage (its "roleset"). Numbered arguments (ARG0 through ARG5) have verb-specific meanings: for "break," ARG0 is the breaker and ARG1 is the thing broken.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, SRL assigns semantic roles to spans of text with respect to a predicate (typically a verb, though nominal predicates are also annotated). The roles describe the relationship between the argument and the event: who initiated it (agent), who was affected (patient/theme), the instrument used, the location, the time, and so on.' },
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
