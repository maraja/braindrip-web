import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const stages = [
  { name: 'Input Image', icon: '🖼️', desc: 'Raw image pixels (e.g., 224x224x3)', detail: 'The image is loaded as a grid of RGB pixel values. Typical resolutions: 224x224, 336x336, or 448x448.', dim: '224 × 224 × 3' },
  { name: 'Vision Encoder', icon: '👁️', desc: 'ViT splits image into patches, encodes each', detail: 'A Vision Transformer (ViT) divides the image into 16x16 patches, adds position embeddings, then processes through transformer layers.', dim: '196 × 1024' },
  { name: 'Projection Layer', icon: '🔄', desc: 'Maps vision features to LLM embedding space', detail: 'An MLP or linear layer projects vision encoder outputs into the same dimensional space as the LLM text embeddings.', dim: '196 × 4096' },
  { name: 'LLM Backbone', icon: '🧠', desc: 'Processes visual + text tokens together', detail: 'The projected image tokens are concatenated with text prompt tokens. The LLM attends over both modalities jointly.', dim: '(196+N) × 4096' },
  { name: 'Text Output', icon: '📝', desc: 'Generates response autoregressively', detail: 'The LLM generates text tokens one at a time, informed by both the visual and textual context in the sequence.', dim: 'Tokens' },
];

export default function VLMPipelineViz() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>VLM Pipeline</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Step through how an image flows through a vision-language model.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1.25rem', alignItems: 'center' }}>
        {stages.map((s, i) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', flex: 1 }}>
            <button onClick={() => setActiveStage(i)} style={{
              flex: 1, padding: '0.5rem 0.3rem', borderRadius: '8px', border: `1px solid ${activeStage === i ? '#C76B4A' : '#E5DFD3'}`,
              background: activeStage === i ? 'rgba(199,107,74,0.08)' : '#F0EBE1', cursor: 'pointer',
              textAlign: 'center', fontSize: '0.68rem', color: activeStage === i ? '#C76B4A' : '#5A6B5C', fontWeight: activeStage === i ? 600 : 400,
            }}>
              <div style={{ fontSize: '1rem' }}>{s.icon}</div>
              <div>{s.name}</div>
            </button>
            {i < stages.length - 1 && <span style={{ color: '#D4C5A9', fontSize: '0.8rem' }}>→</span>}
          </div>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2C3E2D' }}>{stages[activeStage].name}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#C76B4A', background: 'rgba(199,107,74,0.08)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{stages[activeStage].dim}</span>
        </div>
        <div style={{ fontSize: '0.82rem', color: '#5A6B5C', lineHeight: 1.6 }}>{stages[activeStage].detail}</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
        <button onClick={() => setActiveStage(Math.max(0, activeStage - 1))} disabled={activeStage === 0} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: activeStage === 0 ? '#D4C5A9' : '#5A6B5C', cursor: activeStage === 0 ? 'default' : 'pointer', fontSize: '0.78rem' }}>← Previous</button>
        <button onClick={() => setActiveStage(Math.min(stages.length - 1, activeStage + 1))} disabled={activeStage === stages.length - 1} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: activeStage === stages.length - 1 ? '#D4C5A9' : '#5A6B5C', cursor: activeStage === stages.length - 1 ? 'default' : 'pointer', fontSize: '0.78rem' }}>Next →</button>
      </div>
    </div>
  );
}
