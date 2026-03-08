import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEWhatIsAPrompt() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a prompt like writing a formal letter. The envelope has a return address (system message) that tells the recipient who they are dealing with. The subject line (user query) states the purpose. The body (conversation history) provides context. And a postscript (assistant prefill) can nudge the reply in a particular direction.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The system message is the first segment in most API calls. It sets the model\'s persona, behavioral constraints, and global instructions. In the OpenAI and Anthropic APIs, it occupies a privileged position: models are fine-tuned to treat system content as higher-authority than user content.' },
    { emoji: '🔍', label: 'In Detail', text: 'A prompt is not just the text a human types into a chatbox. It is the entire structured payload that an application sends to a language model\'s API. In production systems, the "prompt" a user sees is often less than 10% of the actual tokens sent to the model.' },
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
