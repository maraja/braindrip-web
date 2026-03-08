import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCVisionFoundationModels() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'In natural language processing, GPT and BERT showed that a single pretrained model could serve as the starting point for virtually any text task. Vision foundation models aim to do the same for images: train one powerful model on massive, diverse visual data, and then adapt it to classification, detection, segmentation, depth estimation, tracking,.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Language-supervised: CLIP / SigLIP / EVA-CLIP Train on image-text pairs with contrastive objectives Learn features aligned with natural language semantics Strengths: zero-shot recognition, text-conditioned retrieval, multimodal reasoning Weakness: Spatial features are less precise than self-supervised alternatives  Self-supervised: DINOv2 / MAE /.' },
    { emoji: '🔍', label: 'In Detail', text: 'The term "foundation model" was formalized by Bommasani et al. (2021) at Stanford to describe models that are (1) trained on broad data at scale, (2) adapted to a wide range of downstream tasks, and (3) exhibit emergent capabilities not explicitly trained for.' },
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
