import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACWhatIsAnAiAgent() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you hire a human assistant and hand them a laptop, a set of written instructions, and access to various tools — a web browser, a code editor, a calendar, and a database. You say, "Here\'s what I need done," and walk away.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Every AI agent architecture includes three fundamental components:  Perception — The agent\'s ability to receive and interpret information from its environment. This includes parsing tool outputs (JSON responses, file contents, error messages), reading user instructions, and processing multimodal inputs like screenshots or logs.' },
    { emoji: '🔍', label: 'In Detail', text: 'An AI agent is a system built around an LLM that goes beyond the single-turn pattern of "user asks, model answers." Instead, it operates in a loop: it receives observations from its environment (tool outputs, user messages, file contents), reasons about what to do next, takes an action (calling a tool, writing code, sending a message), and then.' },
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
