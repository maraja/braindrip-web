import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE07LamdaAndConversationalAi() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine training someone to be the world\'s best dinner party conversationalist. You would not just give them an encyclopedia — you would expose them to millions of real conversations, teach them to check their facts, warn them about topics to handle carefully, and help them develop a sense of what makes a reply genuinely interesting vs.' },
    { emoji: '⚙️', label: 'How It Works', text: 'LaMDA was pre-trained on 1.56 trillion words from a corpus called "Infiniset," comprising public forums, dialogue from the web, and other conversational text sources, in addition to standard web documents.' },
    { emoji: '🔍', label: 'In Detail', text: 'LaMDA (Language Model for Dialogue Applications) was introduced by Romal Thoppilan and over 60 co-authors at Google in a paper published in January 2022. It was a 137-billion-parameter decoder-only Transformer, but its distinctiveness lay not in its architecture but in its training data and fine-tuning approach.' },
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
