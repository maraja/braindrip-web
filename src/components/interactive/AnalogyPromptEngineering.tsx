import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyPromptEngineering() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🎬', label: 'Director\'s Brief', text: 'A film director gives actors specific direction: "You\'re a tired detective in a noir film, speak slowly, look suspicious." Prompt engineering is crafting that brief for the LLM — the more precise your instructions, role, context, and examples, the better the performance. A vague "write something about dogs" gets generic output; a detailed brief gets exactly what you need.' },
    { emoji: '🔑', label: 'Combination Lock', text: 'An LLM is like a vault with a combination lock. Prompt engineering is figuring out the right combination — the specific wording, structure, and examples that unlock the model\'s best performance for your task. Small changes in phrasing can dramatically change output quality, just like being one digit off on a combination lock.' },
    { emoji: '🧪', label: 'Lab Protocol', text: 'Scientists follow precise protocols to get reproducible results. Prompt engineering develops reliable "protocols" for LLMs: system prompts set the role, few-shot examples demonstrate the format, chain-of-thought instructions encourage reasoning, and output schemas constrain the response. Like lab work, it\'s iterative — you test, observe, refine, and document what works.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
