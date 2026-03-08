import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACReactPattern() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a detective investigating a crime scene. They don\'t just blindly collect evidence (acting without thinking) or sit in an armchair theorizing (thinking without acting). Instead, they reason: "The window is broken from the outside, so the intruder likely entered here." Then they act: dust the windowsill for fingerprints.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The core structure of ReAct is a repeating three-part cycle:  Thought: The agent generates an internal reasoning trace. This is not sent to any external tool; it is the agent\'s private deliberation. Example: "I need to find the population of France as of 2023.' },
    { emoji: '🔍', label: 'In Detail', text: 'ReAct (Reasoning + Acting) was introduced by Yao et al. in 2022 as a paradigm that combines the strengths of chain-of-thought reasoning with action-taking in an interleaved manner. Before ReAct, agents either reasoned in isolation (like chain-of-thought prompting for QA tasks) or acted without explicit reasoning traces (like traditional RL agents).' },
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
