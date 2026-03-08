import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLGATokenStreaming() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Picture a news ticker scrolling across the bottom of a TV screen. Each word appears the moment it is available rather than waiting for the entire headline to be written. Token streaming works the same way -- instead of waiting for the LLM to finish its entire response, you receive each token (roughly a word or word fragment) the instant the model.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Each msg is an AIMessageChunk object containing a small piece of the response. The end="" and flush=True arguments ensure tokens print on the same line without buffering.' },
    { emoji: '🔍', label: 'In Detail', text: 'Without token streaming, a user staring at a chat interface sees nothing until the model finishes -- which can take 5 to 30 seconds for long responses. With token streaming, the first token appears in under a second, and the response builds in real time. This perceived speed is what makes modern chat applications feel responsive.' },
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
