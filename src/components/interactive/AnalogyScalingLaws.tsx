import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyScalingLaws() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📈', label: 'Investment Returns', text: 'Scaling laws are like compound interest formulas for AI. They show that loss decreases as a power law with model size, data size, and compute. Double the compute, get a predictable improvement. This lets labs forecast: "If we spend $100M on training, the model will reach X loss." Like financial planning, these laws help allocate budgets optimally between bigger models and more data.' },
    { emoji: '🏗', label: 'Building Codes', text: 'Building codes tell architects what size foundation supports what height building. Scaling laws are building codes for LLMs: they predict how much data a given model size needs (Chinchilla scaling), and how performance improves with scale. The Chinchilla insight was that most models were under-trained: a smaller model trained on more data outperforms a larger model trained on less.' },
    { emoji: '🔬', label: 'Physics Laws', text: 'Like physics laws (F=ma), scaling laws describe empirical regularities: loss ~ C * N^(-a) * D^(-b), where N is parameters and D is data tokens. These power laws hold over many orders of magnitude, allowing researchers to train small models cheaply and extrapolate performance of models 1000x larger. This predictability transformed LLM development from art into engineering.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
