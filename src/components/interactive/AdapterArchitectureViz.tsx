import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

type Method = { name: string; params: string; where: string; description: string; layers: { label: string; color: string; isNew: boolean; height: number }[] };

const METHODS: Method[] = [
  { name: 'Adapter Layers', params: '~0.5-3% of model', where: 'Inside transformer block', description: 'Bottleneck layers inserted after attention and FFN sub-layers. Down-project to a small dimension, apply nonlinearity, then up-project back.', layers: [
    { label: 'Layer Norm', color: 'rgba(44,62,45,0.1)', isNew: false, height: 22 },
    { label: 'Self-Attention', color: 'rgba(44,62,45,0.15)', isNew: false, height: 36 },
    { label: 'Adapter ↓↑', color: 'rgba(199,107,74,0.35)', isNew: true, height: 24 },
    { label: 'Add & Norm', color: 'rgba(44,62,45,0.1)', isNew: false, height: 22 },
    { label: 'Feed-Forward', color: 'rgba(44,62,45,0.15)', isNew: false, height: 36 },
    { label: 'Adapter ↓↑', color: 'rgba(199,107,74,0.35)', isNew: true, height: 24 },
    { label: 'Add & Norm', color: 'rgba(44,62,45,0.1)', isNew: false, height: 22 },
  ]},
  { name: 'Prefix Tuning', params: '~0.1% of model', where: 'Prepended to K,V in attention', description: 'Learnable continuous vectors prepended to the key and value matrices at every transformer layer. The model attends to these virtual tokens alongside real input.', layers: [
    { label: 'Layer Norm', color: 'rgba(44,62,45,0.1)', isNew: false, height: 22 },
    { label: 'Prefix K,V', color: 'rgba(212,168,67,0.35)', isNew: true, height: 20 },
    { label: 'Self-Attention', color: 'rgba(44,62,45,0.15)', isNew: false, height: 36 },
    { label: 'Add & Norm', color: 'rgba(44,62,45,0.1)', isNew: false, height: 22 },
    { label: 'Feed-Forward', color: 'rgba(44,62,45,0.15)', isNew: false, height: 36 },
    { label: 'Add & Norm', color: 'rgba(44,62,45,0.1)', isNew: false, height: 22 },
  ]},
  { name: 'Prompt Tuning', params: '~0.001% of model', where: 'Input embedding layer only', description: 'Learnable soft tokens prepended only at the input. Unlike prefix tuning, these exist only at the first layer. Extremely parameter-efficient but may underperform for smaller models.', layers: [
    { label: 'Soft Tokens', color: 'rgba(139,168,136,0.4)', isNew: true, height: 20 },
    { label: 'Input Embedding', color: 'rgba(44,62,45,0.15)', isNew: false, height: 28 },
    { label: 'Transformer Block 1', color: 'rgba(44,62,45,0.1)', isNew: false, height: 36 },
    { label: 'Transformer Block 2', color: 'rgba(44,62,45,0.1)', isNew: false, height: 36 },
    { label: '...', color: 'rgba(44,62,45,0.05)', isNew: false, height: 20 },
    { label: 'Transformer Block N', color: 'rgba(44,62,45,0.1)', isNew: false, height: 36 },
  ]},
  { name: '(IA)³', params: '~0.01% of model', where: 'Rescales K, V, and FFN', description: 'Infused Adapter by Inhibiting and Amplifying Inner Activations. Learns three rescaling vectors that multiply keys, values, and FFN intermediate activations. No added layers means zero inference latency overhead.', layers: [
    { label: 'Layer Norm', color: 'rgba(44,62,45,0.1)', isNew: false, height: 22 },
    { label: 'Self-Attention (K×lₖ, V×lᵥ)', color: 'rgba(44,62,45,0.15)', isNew: false, height: 36 },
    { label: '⊗ lₖ, lᵥ vectors', color: 'rgba(199,107,74,0.25)', isNew: true, height: 14 },
    { label: 'Add & Norm', color: 'rgba(44,62,45,0.1)', isNew: false, height: 22 },
    { label: 'Feed-Forward (×l_ff)', color: 'rgba(44,62,45,0.15)', isNew: false, height: 36 },
    { label: '⊗ l_ff vector', color: 'rgba(199,107,74,0.25)', isNew: true, height: 14 },
    { label: 'Add & Norm', color: 'rgba(44,62,45,0.1)', isNew: false, height: 22 },
  ]},
];

export default function AdapterArchitectureViz() {
  const [selected, setSelected] = useState(0);
  const method = METHODS[selected];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          PEFT Architecture Comparison
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {METHODS.map((m, i) => (
          <button key={m.name} onClick={() => setSelected(i)} style={{
            padding: '0.5rem 0.4rem', borderRadius: '8px', border: `1.5px solid ${i === selected ? '#C76B4A' : '#E5DFD3'}`,
            background: i === selected ? 'rgba(199,107,74,0.06)' : '#FDFBF7', cursor: 'pointer',
            fontSize: '0.75rem', color: i === selected ? '#C76B4A' : '#5A6B5C', fontWeight: i === selected ? 600 : 400,
            fontFamily: "'Source Sans 3', system-ui, sans-serif", transition: 'all 0.2s',
          }}>
            {m.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: 'rgba(44,62,45,0.03)', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5A6B5C', marginBottom: '0.75rem', textAlign: 'center' as const }}>Architecture</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '3px', maxWidth: '180px', margin: '0 auto' }}>
            {method.layers.map((layer, i) => (
              <div key={i} style={{
                height: `${layer.height}px`, background: layer.color, borderRadius: '4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: layer.isNew ? 600 : 400,
                color: layer.isNew ? '#C76B4A' : '#5A6B5C',
                border: layer.isNew ? '1.5px dashed rgba(199,107,74,0.5)' : '1px solid rgba(44,62,45,0.08)',
                transition: 'all 0.3s',
              }}>
                {layer.label}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '0.75rem', fontSize: '0.65rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(44,62,45,0.12)' }} /> Frozen
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#C76B4A' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', border: '1.5px dashed rgba(199,107,74,0.5)', background: 'rgba(199,107,74,0.2)' }} /> Trainable
            </span>
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.05rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.75rem' }}>
            {method.name}
          </div>
          <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: '0 0 1rem' }}>
            {method.description}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #E5DFD3' }}>
              <span style={{ fontSize: '0.8rem', color: '#5A6B5C' }}>Trainable params</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#C76B4A', fontWeight: 600 }}>{method.params}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #E5DFD3' }}>
              <span style={{ fontSize: '0.8rem', color: '#5A6B5C' }}>Insertion point</span>
              <span style={{ fontSize: '0.8rem', color: '#2C3E2D' }}>{method.where}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
              <span style={{ fontSize: '0.8rem', color: '#5A6B5C' }}>Latency overhead</span>
              <span style={{ fontSize: '0.8rem', color: '#2C3E2D' }}>{selected === 0 ? 'Small' : selected === 3 ? 'None' : 'Minimal'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
