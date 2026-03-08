import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEPromptTestingAndEvaluation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of prompt evaluation as unit tests for your prompts. In software engineering, you would never ship code without running a test suite to verify it works correctly. Yet many teams deploy prompts based on vibes — trying a few examples manually, seeing they look good, and shipping.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A good eval dataset contains 50-200 test cases that represent the full distribution of inputs your prompt will encounter in production. Each test case includes an input (the user query or task), an expected output or set of acceptable outputs, and optionally metadata like difficulty level, category, or edge case labels.' },
    { emoji: '🔍', label: 'In Detail', text: 'The core challenge is that LLM outputs are non-deterministic and open-ended. Unlike a function that returns true or false, a prompt might produce thousands of valid phrasings for the same correct answer.' },
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
