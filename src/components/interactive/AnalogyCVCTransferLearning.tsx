import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCTransferLearning() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider a radiologist who spent years learning general anatomy before specializing in chest X-rays. They did not forget everything about anatomy when they switched focus -- they built upon it. Transfer learning follows the same principle: a network trained on ImageNet has already learned to detect edges, textures, parts, and objects.' },
    { emoji: '⚙️', label: 'How It Works', text: '(2014) showed that the first layers of CNNs learn general features (Gabor-like filters, color blobs) that are nearly identical across different tasks and datasets. Deeper layers become increasingly task-specific. This hierarchy means early-layer features are almost universally useful.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, transfer learning assumes a source domain &#123;D&#125;_S with task &#123;T&#125;_S and a target domain &#123;D&#125;_T with task &#123;T&#125;_T. The goal is to improve the learning of the target predictive function f_T using knowledge from &#123;D&#125;_S and &#123;T&#125;_S, where &#123;D&#125;_S  &#123;D&#125;_T or &#123;T&#125;_S  &#123;T&#125;_T.' },
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
