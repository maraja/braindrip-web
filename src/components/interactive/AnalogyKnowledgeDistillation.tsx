import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyKnowledgeDistillation() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '👨‍🏫', label: 'Teacher & Student', text: 'A master teacher (large model) doesn\'t just share answers but shares their thinking — "I\'m 90% sure it\'s a cat, 8% dog, 2% fox." The student (small model) learns from these soft probability distributions, which contain richer information than hard labels alone. The student learns not just what\'s right, but what\'s similar to what, inheriting the teacher\'s nuanced understanding in a compact form.' },
    { emoji: '📖', label: 'CliffsNotes', text: 'The teacher model is like a 1000-page textbook; distillation creates CliffsNotes that capture the essential knowledge in 100 pages. The small student model is trained to mimic the teacher\'s output distributions, effectively compressing the big model\'s knowledge into a fraction of the parameters. You get 80-95% of the performance at a fraction of the compute cost.' },
    { emoji: '🍷', label: 'Wine Essence', text: 'Distilling wine concentrates the essential flavors into a smaller, more potent form. Knowledge distillation concentrates a large model\'s learned representations into a smaller model. The key insight: the teacher\'s soft probability outputs ("this is probably a 7, maybe an 8, definitely not a 3") transfer more knowledge than just the hard label ("7"), because they reveal the structure of the learned space.' },
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
