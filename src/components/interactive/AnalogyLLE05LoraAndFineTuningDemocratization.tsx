import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE05LoraAndFineTuningDemocratization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you\'re a skilled painter who has mastered landscape painting over decades. Now a client wants you to paint portraits. You don\'t need to unlearn everything about painting and start from scratch. Instead, you learn a small set of adjustments -- how to proportion faces, how skin tones differ from skies, how eyes convey emotion.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Consider a weight matrix W in a Transformer layer with dimensions d x k (say, 4096 x 4096, or about 16 million parameters). In full fine-tuning, you\'d update all 16 million values.' },
    { emoji: '🔍', label: 'In Detail', text: 'Before LoRA, fine-tuning a large language model meant updating all of its parameters. For GPT-3\'s 175 billion weights, this required multiple 80 GB A100 GPUs, hundreds of gigabytes of optimizer state, and significant engineering expertise. The cost was prohibitive for all but the largest organizations.' },
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
