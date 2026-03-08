import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEDelimiterAndMarkupStrategies() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of dividers in a filing cabinet. Without dividers, you have a single pile of papers — a contract might be stuck between a receipt and a meeting agenda, and finding anything requires reading everything. Add labeled dividers ("Legal," "Finance," "Meeting Notes") and suddenly each document has a clear home.' },
    { emoji: '⚙️', label: 'How It Works', text: 'XML-style tags are the most structured delimiter option and are explicitly recommended by Anthropic for Claude models:  Advantages: Unambiguous nesting, named sections, attribute support, familiar to models from pretraining on HTML/XML data. Claude models show particularly strong XML tag adherence. Token cost: A typical tag pair (&lt;context&gt;...' },
    { emoji: '🔍', label: 'In Detail', text: 'Delimiters in prompts serve the same function. When a prompt contains multiple types of content — instructions, context documents, examples, user input, output format specifications — delimiters tell the model where each section begins and ends, what type of content each section contains, and how to treat each section.' },
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
