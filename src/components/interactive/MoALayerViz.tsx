import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const layers = [
  { name: 'Layer 1: Proposers', models: ['GPT-4', 'Claude', 'Gemini'], outputs: ['Answer A: 42, because...', 'Answer B: 42, the calculation...', 'Answer C: I think 41...'] },
  { name: 'Layer 2: Refiners', models: ['Claude', 'Gemini'], outputs: ['Refined: 42 is correct. Answer C had an arithmetic error...', 'Refined: Confirming 42. Here is a cleaner explanation...'] },
  { name: 'Layer 3: Aggregator', models: ['GPT-4'], outputs: ['Final: The answer is 42. Multiple approaches confirm this...'] },
];

export default function MoALayerViz() {
  const [activeLayer, setActiveLayer] = useState(0);
  const [activeModel, setActiveModel] = useState(0);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Mixture of Agents (MoA)</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Multiple LLMs in layers, each refining the outputs of the previous layer.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        {layers.map((layer, i) => (
          <div key={i} onClick={() => { setActiveLayer(i); setActiveModel(0); }} style={{
            padding: '0.6rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
            border: `1px solid ${activeLayer === i ? '#C76B4A' : '#E5DFD3'}`,
            background: activeLayer === i ? 'rgba(199,107,74,0.04)' : i < activeLayer ? 'rgba(139,168,136,0.04)' : 'transparent',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: activeLayer === i ? '#C76B4A' : '#2C3E2D', marginBottom: '0.3rem' }}>{layer.name}</div>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              {layer.models.map((m, j) => (
                <span key={m + j} onClick={(e) => { e.stopPropagation(); setActiveLayer(i); setActiveModel(j); }} style={{
                  padding: '0.2rem 0.45rem', borderRadius: '4px', fontSize: '0.68rem', fontFamily: "'JetBrains Mono', monospace",
                  background: activeLayer === i && activeModel === j ? '#C76B4A' : '#F0EBE1',
                  color: activeLayer === i && activeModel === j ? '#fff' : '#5A6B5C',
                  cursor: 'pointer',
                }}>{m}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const, marginBottom: '0.3rem' }}>
          {layers[activeLayer].models[activeModel]} output (Layer {activeLayer + 1})
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#2C3E2D', lineHeight: 1.6 }}>
          {layers[activeLayer].outputs[activeModel]}
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.3rem', alignItems: 'center', justifyContent: 'center' }}>
        {layers.map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: i <= activeLayer ? '#8BA888' : '#E5DFD3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#fff', fontWeight: 700 }}>{i + 1}</div>
            {i < layers.length - 1 && <div style={{ width: '30px', height: '2px', background: i < activeLayer ? '#8BA888' : '#E5DFD3' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
