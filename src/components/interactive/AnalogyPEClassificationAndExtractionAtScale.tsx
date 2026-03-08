import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEClassificationAndExtractionAtScale() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of classification at scale like quality control on an assembly line. When you inspect one product, you can give it your full attention and catch every defect. But when you need to inspect 10,000 products per hour, you need systematic processes: standardized checklists, sampling strategies, drift detection (are defects increasing over time?' },
    { emoji: '⚙️', label: 'How It Works', text: 'Processing large volumes efficiently requires structured batch approaches:  Consistent prompt template: Use the exact same prompt template for every input. Variations in prompt wording (even minor ones) introduce inconsistencies.' },
    { emoji: '🔍', label: 'In Detail', text: 'Classification and extraction at scale is the practice of applying consistent, reliable prompts across thousands to millions of inputs. Classification assigns categories (sentiment, topic, intent, urgency) to inputs; extraction pulls structured data (entities, dates, amounts, relationships) from unstructured text.' },
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
