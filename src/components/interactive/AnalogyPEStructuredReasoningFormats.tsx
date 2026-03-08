import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEStructuredReasoningFormats() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you need to fill out a form. A tax return asks for very different information in a very different structure than a job application. Each form is designed for a specific purpose: the structure itself guides you to provide the right information in the right order.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The OTA (also called ReAct) format structures reasoning as a cycle of three phases. The model first states its Observation (what it sees, what information is available), then articulates a Thought (interpretation, analysis, planning), and finally declares an Action (what to do next, what to output, or what tool to call).' },
    { emoji: '🔍', label: 'In Detail', text: 'While chain-of-thought prompting lets the model choose its own reasoning structure, structured reasoning formats impose a specific structure chosen by the prompt designer. This trade-off -- less flexibility, more reliability -- is often worthwhile in production systems where consistency and predictability matter.' },
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
