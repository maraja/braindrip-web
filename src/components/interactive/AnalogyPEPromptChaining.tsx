import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEPromptChaining() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of an assembly line where each station performs one specialized job. Station 1 cuts the raw material. Station 2 shapes it. Station 3 polishes it. Station 4 inspects it. No single station does everything, and each station is optimized for its specific task.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A typical chain has 3-7 steps. Each step has:  Input: The output from the previous step (or the original user input for Step 1). Prompt: A focused instruction set optimized for this specific sub-task.' },
    { emoji: '🔍', label: 'In Detail', text: 'Prompt chaining applies this assembly-line principle to LLM workflows. Instead of writing one massive prompt that asks the model to do everything at once — extract data, analyze it, format it, and generate a report — you break the work into discrete steps, each handled by a separate LLM call. Step 1 extracts relevant data.' },
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
