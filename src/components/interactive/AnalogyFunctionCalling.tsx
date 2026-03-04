import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyFunctionCalling() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📱', label: 'Personal Assistant + Phone', text: 'An LLM with tools is like a personal assistant who can pick up the phone. They understand your request ("book a flight to Paris"), decide which service to call (airline API), formulate the right query (dates, destination), make the call, and relay the result back to you. The LLM decides when and how to use tools, but the actual execution happens externally.' },
    { emoji: '🧰', label: 'Swiss Army Knife', text: 'Without tools, an LLM is bare hands — smart but limited. Function calling gives it a Swiss Army knife: a calculator for math, a search engine for current info, a database connector for lookups, a code executor for computation. The model reads the tool descriptions, decides which blade to pull out, formats the arguments, and interprets the results.' },
    { emoji: '🎮', label: 'Game Controller', text: 'The LLM is the player; tools are the controller buttons. The model reads the game state (conversation), decides what action to take (which function to call), presses the right button with the right timing (generates structured function call with arguments), and the game engine (your backend) executes it. The model orchestrates; the tools act.' },
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
