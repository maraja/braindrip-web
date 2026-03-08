import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPESystemPromptAnatomy() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a system prompt as the combination of a job description and an employee handbook for an LLM. The job description tells the model what role it plays, what it is responsible for, and what its goals are. The employee handbook specifies rules, procedures, acceptable behaviors, and how to handle edge cases.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The role definition establishes the model\'s identity, expertise, and perspective. It answers the question: "Who are you in this conversation?"  A strong role definition includes the persona ("You are a senior tax accountant"), the domain expertise ("with 15 years of experience in corporate tax law"), and the communication style ("you explain.' },
    { emoji: '🔍', label: 'In Detail', text: 'System prompts are the most persistent and influential piece of text in any LLM application. Unlike user messages that change with each turn, the system prompt is injected at the beginning of every conversation and (in well-designed systems) reinforced throughout.' },
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
