import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE07TrainingEfficiencyBreakthroughs() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Training a modern LLM is one of the most expensive computational tasks humans have ever undertaken. GPT-4\'s training reportedly cost over 100 million. The quest for training efficiency is the effort to achieve equivalent model quality with less compute, less memory, less time, and less money.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The most direct way to speed up training is to use fewer bits per number. FP32 (32-bit floating point) was the default for early neural networks — safe but slow and memory-hungry. Mixed Precision training (Micikevicius et al.' },
    { emoji: '🔍', label: 'In Detail', text: 'No single technique delivers a dramatic improvement, but the compounding effect of dozens of incremental innovations is transformative. DeepSeek V3 — trained for 5.6 million to achieve frontier performance — is the poster child for what aggressive efficiency optimization can accomplish.' },
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
