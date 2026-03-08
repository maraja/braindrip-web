import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLGAMultiAgentContentPipeline() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'This project builds a content production system with three specialized agents coordinated by a supervisor. The researcher gathers information, the writer produces a draft, and the editor reviews with structured feedback.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The graph has four nodes: supervisor, researcher, writer, and editor. After each specialist runs, control returns to the supervisor for the next routing decision. The editor\'s structured feedback determines whether to loop back to the writer or finish.' },
    { emoji: '🔍', label: 'In Detail', text: 'The supervisor never produces content itself. Its only job is routing. Each agent has a distinct role and distinct tools. This separation of concerns mirrors how real content teams operate and demonstrates why multi-agent architectures outperform monolithic prompts on complex tasks.' },
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
