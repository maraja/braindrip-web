import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyReActPattern() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🔬', label: 'Scientific Method', text: 'ReAct (Reasoning + Acting) follows the scientific method: Observe the problem, form a hypothesis (Thought), run an experiment (Action), examine the results (Observation), then think again. The model explicitly writes out its reasoning before each tool call, creating an interleaved chain of Thought-Action-Observation that makes the agent\'s decision-making transparent and debuggable.' },
    { emoji: '🗣️', label: 'Think Aloud Protocol', text: 'When a chess player narrates their thinking — "If I move here, they\'ll respond there, so instead I should..." — that\'s thinking aloud. ReAct makes the LLM do this: before each action, it writes a "Thought" explaining its reasoning. This isn\'t just for transparency — the explicit reasoning actually helps the model make better decisions about which tool to use and what to do next.' },
    { emoji: '📓', label: 'Lab Notebook', text: 'A scientist keeps a lab notebook: "I think X is causing the issue (thought). Let me run test Y (action). Results show Z (observation). Given Z, I now think..." ReAct gives agents this same structured loop. Each cycle of thought-action-observation builds context for the next step, allowing the model to reason about intermediate results and adapt its strategy dynamically.' },
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
