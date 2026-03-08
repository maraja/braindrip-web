import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE05InstructionTuningAndFlan() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are training a dog. You could teach it "sit" by physically pushing its hindquarters down every time you say the word — this is task-specific fine-tuning, one command at a time.' },
    { emoji: '⚙️', label: 'How It Works', text: 'FLAN was built on top of a 137B parameter LaMDA-PT model (a pre-trained version of the model that became LaMDA). The training data consisted of 62 NLP datasets grouped into 12 task clusters: natural language inference, reading comprehension, closed-book QA, translation, commonsense reasoning, coreference resolution, struct-to-text, sentiment.' },
    { emoji: '🔍', label: 'In Detail', text: 'The concept was formalized by Jason Wei and colleagues at Google in the 2021 paper introducing FLAN (Fine-tuned LAnguage Net). The team took a 137B parameter language model and fine-tuned it on over 60 NLP datasets, each rephrased as a natural-language instruction.' },
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
