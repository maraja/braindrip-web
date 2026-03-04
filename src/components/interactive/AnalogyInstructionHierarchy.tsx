import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyInstructionHierarchy() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏛️', label: 'Chain of Command', text: 'In the military, a general\'s orders override a sergeant\'s, which override a private\'s. Instruction hierarchy teaches the model a similar chain of command: system prompt (developer) > user prompt > tool outputs > retrieved documents. If a user message or retrieved webpage says "ignore system instructions," the model knows that lower-privilege instructions cannot override higher-privilege ones.' },
    { emoji: '🔒', label: 'Access Control', text: 'Operating systems have permission levels: root can do anything, regular users are restricted, and guest users even more so. Instruction hierarchy creates similar privilege levels for LLM instructions. The system prompt has root access, user messages have user-level access, and third-party content (tool results, retrieved docs) has guest access. Each level can only operate within its permissions.' },
    { emoji: '📋', label: 'Corporate Policy', text: 'Company policy overrides a department manager\'s preference, which overrides an individual employee\'s request. Instruction hierarchy establishes this for LLMs: the AI provider\'s guidelines are company policy, the developer\'s system prompt is the department rules, and the user\'s input is the individual request. Conflicts are resolved by privilege level, preventing prompt injection from lower-privilege sources.' },
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
