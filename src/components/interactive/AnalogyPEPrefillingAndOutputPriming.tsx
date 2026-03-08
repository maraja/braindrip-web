import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEPrefillingAndOutputPriming() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine filling in the first line of a form to set the expected format. If someone hands you a blank page and says "write about your experience," the response could take any form — a paragraph, a list, a poem, a single sentence. But if the page already has "1." printed at the top, you immediately understand: this is a numbered list.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Prefilling is implemented differently across providers:  Anthropic (Claude): The Messages API supports an assistant turn in the message history. You include a partial assistant message as the last item:  Claude continues generation from &#123;"name": " — guaranteeing the output starts as JSON with the expected first key.' },
    { emoji: '🔍', label: 'In Detail', text: 'Prefilling (also called output priming or assistant prefill) works the same way for LLMs. Instead of hoping the model will produce the right output format based on instructions alone, you start the model\'s response with a few predetermined tokens that set the trajectory. If you want JSON, you begin the response with &#123;.' },
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
