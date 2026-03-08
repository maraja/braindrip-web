import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCMaskedImageModeling() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a jigsaw puzzle where 75% of the pieces are hidden. A skilled puzzle solver can infer the missing pieces from the visible ones because natural images have strong structure: edges continue, textures repeat, and objects have coherent shapes. Masked Image Modeling trains a neural network to be that puzzle solver.' },
    { emoji: '⚙️', label: 'How It Works', text: 'BEiT (Bao et al., 2022, Microsoft) takes a two-stage approach:  Stage 1 -- Train a visual tokenizer: A discrete variational autoencoder (dVAE) compresses each 16 x 16 patch into one of 8192 discrete visual tokens. This tokenizer is trained separately on the image dataset. Stage 2 -- Masked prediction: Approximately 40% of patches are masked.' },
    { emoji: '🔍', label: 'In Detail', text: 'MIM is the vision analog of masked language modeling (MLM), the pre-training objective behind BERT. Where BERT masks ~15% of text tokens and predicts them, MIM masks a much larger fraction of image patches (often 75%) and reconstructs them.' },
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
