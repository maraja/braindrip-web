import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEPromptEngineeringVsContextEngineering() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of designing a university exam. Prompt engineering is writing the exam questions: choosing the wording, specifying the format of expected answers, deciding how many points each question is worth, and adding clarifying instructions. Context engineering is deciding what study materials students can bring into the exam room: a textbook?' },
    { emoji: '⚙️', label: 'How It Works', text: 'PE operates on the instruction and example content of the prompt. Its techniques include:  System message design: Writing the persona, behavioral constraints, and global instructions that frame model behavior.' },
    { emoji: '🔍', label: 'In Detail', text: 'Prompt engineering (PE) has been the dominant framing since GPT-3: how do you write instructions, examples, and constraints that get the model to do what you want? This encompasses techniques like few-shot prompting, chain-of-thought, role prompting, and output format specification.' },
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
