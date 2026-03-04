import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyAIAgents() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🕵️', label: 'Detective', text: 'A regular LLM answers one question at a time. An AI agent is like a detective given a case: it plans an investigation strategy, gathers evidence (uses tools), follows leads (chains multiple steps), re-evaluates based on findings, and keeps going until the case is solved. It has a goal, autonomy to decide next steps, and the ability to act on the world through tools.' },
    { emoji: '🤖', label: 'Autonomous Robot', text: 'An LLM is like a brain in a jar — it can think but can\'t act. An AI agent gives that brain a body: it can observe (read files, browse web), plan (decide what to do next), act (call APIs, write code), and reflect (evaluate if the result is good). The agent loop — observe, think, act, observe — continues until the task is complete or a limit is reached.' },
    { emoji: '👨‍💼', label: 'Intern with Initiative', text: 'An LLM is like an employee who answers exactly what you ask. An AI agent is like a capable intern: you say "research competitors and write a report" and they break it down into steps, search the web, take notes, draft sections, review their work, revise, and deliver a finished product — all with minimal hand-holding. They manage their own workflow autonomously.' },
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
