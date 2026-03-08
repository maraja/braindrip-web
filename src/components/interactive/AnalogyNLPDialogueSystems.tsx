import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPDialogueSystems() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two very different conversations. In the first, you call an airline to rebook a flight: the agent asks structured questions (departure city, date, seat preference), looks up options in a database, and confirms your booking.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The classic architecture follows a pipeline with four components:  Natural Language Understanding (NLU): Parses user utterances into structured intent and slot-value pairs. Input: "Book me a flight from Boston to Seattle next Friday" Intent: book_flight Slots: &#123;origin: Boston, destination: Seattle, date: next Friday&#125;  NLU typically uses a text.' },
    { emoji: '🔍', label: 'In Detail', text: 'Dialogue systems (also called conversational AI) are NLP systems that conduct multi-turn conversations with users. Task-oriented dialogue systems help users accomplish specific goals (booking flights, ordering food, troubleshooting tech issues).' },
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
