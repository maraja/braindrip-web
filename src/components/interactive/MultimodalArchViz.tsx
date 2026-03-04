import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const archs = [
  { name: 'Early Fusion', desc: 'Image tokens concatenated with text tokens before the LLM. Simple but effective.', models: 'LLaVA, GPT-4V', blocks: ['Image', '→ Vision Encoder', '→ Linear Proj', '⊕ Text Tokens', '→ LLM', '→ Output'], fusionPoint: 3, pros: 'Deep cross-modal attention', cons: 'High compute for long sequences' },
  { name: 'Cross-Attention', desc: 'Image features injected via cross-attention layers inside the LLM.', models: 'Flamingo, Idefics', blocks: ['Image', '→ Vision Encoder', '→ Perceiver', '✕ Cross-Attn', '→ LLM', '→ Output'], fusionPoint: 3, pros: 'Flexible, fewer visual tokens', cons: 'Modified LLM architecture' },
  { name: 'Late Fusion', desc: 'Separate encoders process each modality, outputs combined at the end.', models: 'CLIP-based systems', blocks: ['Image', '→ Vision Encoder', '→ Image Emb', '|| Text Emb', '→ Combine', '→ Output'], fusionPoint: 4, pros: 'Modality-independent', cons: 'Limited cross-modal reasoning' },
];

export default function MultimodalArchViz() {
  const [archIdx, setArchIdx] = useState(0);
  const arch = archs[archIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Multimodal Fusion Architectures</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare how vision encoders fuse with LLMs in different architectures.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {archs.map((a, i) => (
          <button key={a.name} onClick={() => setArchIdx(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${archIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: archIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: archIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: archIdx === i ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>{a.name}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {arch.blocks.map((b, i) => (
          <div key={i} style={{
            padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace",
            background: i === arch.fusionPoint ? 'rgba(199,107,74,0.15)' : '#F0EBE1',
            border: i === arch.fusionPoint ? '1px solid #C76B4A' : '1px solid transparent',
            color: i === arch.fusionPoint ? '#C76B4A' : '#2C3E2D', fontWeight: i === arch.fusionPoint ? 700 : 400,
          }}>{b}</div>
        ))}
      </div>

      <div style={{ fontSize: '0.82rem', color: '#5A6B5C', marginBottom: '0.75rem' }}>{arch.desc}</div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
        <div><div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const }}>Models</div><div style={{ fontSize: '0.78rem', color: '#2C3E2D' }}>{arch.models}</div></div>
        <div><div style={{ fontSize: '0.6rem', color: '#8BA888', fontWeight: 600, textTransform: 'uppercase' as const }}>Pros</div><div style={{ fontSize: '0.78rem', color: '#2C3E2D' }}>{arch.pros}</div></div>
        <div><div style={{ fontSize: '0.6rem', color: '#C76B4A', fontWeight: 600, textTransform: 'uppercase' as const }}>Cons</div><div style={{ fontSize: '0.78rem', color: '#2C3E2D' }}>{arch.cons}</div></div>
      </div>
    </div>
  );
}
