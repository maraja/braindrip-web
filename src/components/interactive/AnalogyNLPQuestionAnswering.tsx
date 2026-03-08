import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPQuestionAnswering() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a reference librarian. When you ask a question, the librarian might flip to the right page in an encyclopedia and point to the exact sentence containing the answer (extractive QA). Or the librarian might read several sources, synthesize the information, and explain the answer in their own words (abstractive QA).' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given a question and a context passage, extractive QA identifies the answer as a contiguous span within the passage. SQuAD-Style Architecture: The model encodes the question and passage jointly (typically with BERT or similar), then predicts start and end token positions of the answer span:  BERT-large achieved 87.4 F1 on SQuAD 1.1 (Devlin et al.' },
    { emoji: '🔍', label: 'In Detail', text: 'Question answering (QA) is the task of automatically providing answers to questions posed in natural language. Unlike information retrieval, which returns documents, QA returns precise answers -- a span of text, a generated sentence, or a structured fact.' },
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
