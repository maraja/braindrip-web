import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCOpenVocabularyDetection() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Traditional object detectors are like customs officers who only know a fixed list of items to look for -- if something is not on the list, it passes through unnoticed. Open-vocabulary detection (OVD) replaces that fixed checklist with a language-based interface: you describe what you want to find in words, and the detector locates it.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Most OVD methods share a three-stage pipeline:  Region proposal: Generate class-agnostic bounding box candidates (RPN, deformable attention, or anchor-free heads) Region encoding: Extract visual features for each proposed region Text-conditioned classification: Score each region against text embeddings instead of a fixed classifier  The.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, OVD replaces the fixed classification head of a detector (a linear layer mapping region features to C class logits) with a similarity computation between region features and text embeddings.' },
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
