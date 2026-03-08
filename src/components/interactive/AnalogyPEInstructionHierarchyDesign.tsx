import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEInstructionHierarchyDesign() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a military chain of command. A general\'s orders override a colonel\'s, which override a lieutenant\'s, which override a sergeant\'s. When orders conflict, the higher-ranking source prevails. No amount of persuasion from a sergeant can override a general\'s directive.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The standard instruction hierarchy has four levels, from highest to lowest priority:  System/Platform level: Instructions from the model provider\'s training and safety layers. These are baked into the model and cannot be overridden by any prompt-level instruction. Developer level: The system prompt and any developer-injected instructions.' },
    { emoji: '🔍', label: 'In Detail', text: 'Instruction hierarchy is not merely an academic concern. In any LLM application that accepts user input, there is a risk of prompt injection: the user (or data the user provides) contains instructions that attempt to override the system prompt.' },
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
