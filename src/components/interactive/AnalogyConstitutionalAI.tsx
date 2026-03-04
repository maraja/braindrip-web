import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyConstitutionalAI() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📜', label: 'Constitution', text: 'Just as a country\'s constitution provides principles that guide all laws, Constitutional AI gives the model a set of written principles ("Be helpful but never assist with harm," "Choose the less deceptive response"). The AI critiques and revises its own outputs against these principles, then is trained on the self-improved responses. The constitution replaces ad-hoc human labeling with systematic, transparent values.' },
    { emoji: '⚖️', label: 'Internal Ethics Board', text: 'Imagine giving a company an internal ethics board that reviews every decision against a written code of conduct. Constitutional AI is that ethics board: the model generates a response, then a separate "critique" step evaluates it against the constitution\'s principles, then a "revision" step produces an improved response. This critique-revise cycle generates training data without human labelers.' },
    { emoji: '🔄', label: 'Self-Editing Loop', text: 'A writer drafts an article, then re-reads it checking against editorial guidelines: "Is this accurate? Balanced? Clear?" They revise based on this self-review. Constitutional AI applies this process at scale: the model generates responses, critiques them against explicit principles, produces revisions, and trains on the improved versions. This creates a scalable, principle-driven alignment method pioneered by Anthropic.' },
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
