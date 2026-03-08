import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPPromptBasedNlp() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you want to know if a movie review is positive or negative, but instead of training a classifier, you simply show the review to someone who has read millions of reviews and ask them to complete a sentence: "Overall, this movie was ___." If they fill in "great," the review is positive; if they fill in "terrible," it is negative.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A cloze prompt converts a classification task into a fill-in-the-blank problem compatible with masked language modeling (MLM):  Sentiment Analysis:  Topic Classification:  Natural Language Inference:  For generation-based models (GPT-style), the prompt is formatted as a prefix that the model completes:' },
    { emoji: '🔍', label: 'In Detail', text: 'Prompt-based NLP applies this principle systematically. Rather than adding a task-specific classification head to a pre-trained model and fine-tuning on labeled examples, you design a natural language template (the "prompt") that transforms the task into a form the pre-trained model already knows how to solve -- predicting masked tokens (for.' },
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
