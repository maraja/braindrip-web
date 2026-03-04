import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyMachineUnlearning() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🧽', label: 'Selective Eraser', text: 'Imagine writing an encyclopedia in permanent ink. Someone asks you to remove one entry without rewriting the entire book. Machine unlearning faces this challenge: removing specific knowledge (copyrighted text, personal data, dangerous information) from a trained model without retraining from scratch. It\'s like surgically erasing memories while keeping everything else intact — technically very difficult.' },
    { emoji: '🏠', label: 'Removing a Brick', text: 'A model\'s knowledge is like a brick wall where each brick supports others. Removing one brick (unlearning specific data) risks destabilizing the wall (degrading related capabilities). Machine unlearning must carefully identify which "bricks" encode the target knowledge and modify them without collateral damage to neighboring knowledge. Current techniques use gradient ascent, fine-tuning on altered data, or targeted weight editing.' },
    { emoji: '📸', label: 'Photo Retouching', text: 'Removing someone from a group photo requires careful retouching — you must fill in the gap naturally without leaving artifacts. Machine unlearning similarly must remove specific knowledge while maintaining the model\'s general coherence. Simply training the model to say "I don\'t know" about a topic is surface-level censorship, not true unlearning — the knowledge may still be extractable through clever prompting.' },
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
