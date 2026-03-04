import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const neurons = [
  { id: 'N-417', concept: 'Sentiment (Positive)', triggers: ['great', 'wonderful', 'love', 'amazing', 'excellent'], activations: [0.92, 0.88, 0.85, 0.91, 0.87] },
  { id: 'N-1023', concept: 'Code Syntax', triggers: ['function', 'return', 'const', 'import', 'class'], activations: [0.95, 0.89, 0.82, 0.90, 0.86] },
  { id: 'N-762', concept: 'Geographic Location', triggers: ['Paris', 'Tokyo', 'London', 'Berlin', 'Sydney'], activations: [0.94, 0.91, 0.93, 0.88, 0.86] },
  { id: 'N-2048', concept: 'Negation', triggers: ['not', 'never', "don't", 'no', 'neither'], activations: [0.97, 0.93, 0.90, 0.88, 0.85] },
];

const testSentence = 'The code in Paris was not great';
const wordActivations: Record<number, Record<string, number>> = {
  0: { 'The': 0.02, 'code': 0.05, 'in': 0.01, 'Paris': 0.03, 'was': 0.02, 'not': 0.04, 'great': 0.91 },
  1: { 'The': 0.01, 'code': 0.93, 'in': 0.02, 'Paris': 0.01, 'was': 0.03, 'not': 0.01, 'great': 0.05 },
  2: { 'The': 0.01, 'code': 0.01, 'in': 0.08, 'Paris': 0.94, 'was': 0.01, 'not': 0.02, 'great': 0.01 },
  3: { 'The': 0.01, 'code': 0.02, 'in': 0.01, 'Paris': 0.01, 'was': 0.05, 'not': 0.96, 'great': 0.03 },
};

export default function NeuronActivationViz() {
  const [neuronIdx, setNeuronIdx] = useState(0);
  const n = neurons[neuronIdx];
  const words = testSentence.split(' ');

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Neuron Activation Explorer</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Explore what concepts individual neurons detect in a transformer.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {neurons.map((nn, i) => (
          <button key={nn.id} onClick={() => setNeuronIdx(i)} style={{
            padding: '0.3rem 0.6rem', borderRadius: '6px', border: `1px solid ${neuronIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: neuronIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: neuronIdx === i ? '#C76B4A' : '#5A6B5C',
            fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', fontWeight: neuronIdx === i ? 600 : 400,
          }}>{nn.id}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', textTransform: 'uppercase' as const, fontWeight: 600 }}>Detected Concept</div>
        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#C76B4A' }}>{n.concept}</div>
        <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
          {n.triggers.map((t, i) => (
            <span key={t} style={{ padding: '0.15rem 0.4rem', borderRadius: '4px', background: `rgba(199,107,74,${n.activations[i] * 0.3})`, fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace", color: '#2C3E2D' }}>
              {t} ({(n.activations[i] * 100).toFixed(0)}%)
            </span>
          ))}
        </div>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', textTransform: 'uppercase' as const, fontWeight: 600, marginBottom: '0.4rem' }}>Activation on: "{testSentence}"</div>
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {words.map(w => {
            const act = wordActivations[neuronIdx]?.[w] || 0;
            return (
              <div key={w} style={{ textAlign: 'center' }}>
                <div style={{ padding: '0.25rem 0.4rem', borderRadius: '4px', background: `rgba(199,107,74,${act})`, fontSize: '0.78rem', fontFamily: "'JetBrains Mono', monospace", color: act > 0.5 ? '#fff' : '#2C3E2D' }}>{w}</div>
                <div style={{ fontSize: '0.55rem', color: '#7A8B7C', marginTop: '0.15rem' }}>{(act * 100).toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
