import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACAgentDistillation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a master chef training an apprentice. The master spends years developing recipes through costly experimentation -- failed dishes, wasted ingredients, long hours of trial and error. The apprentice watches the master\'s finished techniques, practices the established recipes, and reaches competency in months rather than years.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The first step is collecting successful agent trajectories from the frontier model. A trajectory is the complete sequence of (state, action, observation) triples from a task\'s start to its successful completion.' },
    { emoji: '🔍', label: 'In Detail', text: 'The economics are compelling. A frontier model like Claude Opus or GPT-4o might cost 15 per million input tokens and require 50K tokens per task, costing 0.75 per task. A distilled model based on Claude Haiku or a fine-tuned open-source model might cost 0.' },
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
