import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE01PreTrainingObjectivesEvolution() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of pre-training objectives as the exercises a student does before the real exam. Early language models did one type of exercise — predict the next word. Over time, researchers invented dozens of variations: fill in blanks, reorder sentences, detect swapped words, predict entire missing paragraphs.' },
    { emoji: '⚙️', label: 'How It Works', text: 'GPT-1 (2018) introduced causal language modeling (CLM): given all previous tokens, predict the next one. This is the simplest objective and the one that ultimately won. Every GPT model, every LLaMA, every modern decoder-only model uses CLM.' },
    { emoji: '🔍', label: 'In Detail', text: 'The story of pre-training objectives is the story of how we learned to teach machines language itself. It begins with simple autoregression, branches into a zoo of alternatives, and converges — surprisingly — back toward the original approach, but with crucial refinements.' },
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
