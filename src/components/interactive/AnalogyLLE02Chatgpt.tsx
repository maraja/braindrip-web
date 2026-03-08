import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE02Chatgpt() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine that for decades, researchers have been building increasingly powerful engines in a laboratory. Each engine is more impressive than the last, but they are all bolted to test stands — academics measure their horsepower, publish papers about their efficiency, and debate their theoretical limits.' },
    { emoji: '⚙️', label: 'How It Works', text: 'ChatGPT\'s foundation was GPT-3.5, a model family that OpenAI never formally published a paper on. GPT-3.5 is generally understood to be a descendant of GPT-3 that was further trained on a mixture of text, code, and instruction data. The "code-davinci-002" model, one of the GPT-3.' },
    { emoji: '🔍', label: 'In Detail', text: 'ChatGPT was released by OpenAI on November 30, 2022, with almost no fanfare — a blog post and a free web interface. There was no accompanying research paper. Under the hood, it was GPT-3.5 (an intermediate model between GPT-3 and GPT-4) that had been fine-tuned for multi-turn conversation using the RLHF pipeline developed for InstructGPT.' },
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
