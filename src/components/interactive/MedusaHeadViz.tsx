import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const heads = [
  { label: 'LM Head', position: 't+1', token: 'the', confidence: 0.92, color: '#2C3E2D' },
  { label: 'Medusa 1', position: 't+2', token: 'quick', confidence: 0.78, color: '#C76B4A' },
  { label: 'Medusa 2', position: 't+3', token: 'brown', confidence: 0.65, color: '#D4A843' },
  { label: 'Medusa 3', position: 't+4', token: 'fox', confidence: 0.51, color: '#8BA888' },
  { label: 'Medusa 4', position: 't+5', token: 'jumps', confidence: 0.38, color: '#7A6F5E' },
];

const treeNodes = [
  { depth: 0, tokens: ['the'], accepted: [true] },
  { depth: 1, tokens: ['quick', 'lazy'], accepted: [true, false] },
  { depth: 2, tokens: ['brown', 'red'], accepted: [true, false] },
  { depth: 3, tokens: ['fox'], accepted: [true] },
];

export default function MedusaHeadViz() {
  const [step, setStep] = useState(0);
  const [showTree, setShowTree] = useState(false);
  const autoSteps = 8;
  const medusaSteps = 3;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Medusa Parallel Decoding Heads
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button onClick={() => { setShowTree(false); setStep(0); }} style={{ padding: '0.4rem 1rem', borderRadius: '8px', border: !showTree ? '2px solid #C76B4A' : '1px solid #E5DFD3', background: !showTree ? 'rgba(199,107,74,0.08)' : 'white', color: '#2C3E2D', cursor: 'pointer', fontFamily: 'inherit', fontWeight: !showTree ? 600 : 400, fontSize: '0.85rem' }}>Parallel Heads</button>
        <button onClick={() => setShowTree(true)} style={{ padding: '0.4rem 1rem', borderRadius: '8px', border: showTree ? '2px solid #C76B4A' : '1px solid #E5DFD3', background: showTree ? 'rgba(199,107,74,0.08)' : 'white', color: '#2C3E2D', cursor: 'pointer', fontFamily: 'inherit', fontWeight: showTree ? 600 : 400, fontSize: '0.85rem' }}>Tree Verification</button>
      </div>

      {!showTree ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#6E8B6B' }}>Input: "The cat sat on"</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
            {heads.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: step >= i ? 1 : 0.25, transition: 'opacity 0.4s' }}>
                <div style={{ width: '90px', fontSize: '0.75rem', fontWeight: 600, color: h.color }}>{h.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#7A6F5E', width: '35px' }}>{h.position}</div>
                <div style={{ flex: 1, background: '#EDE9DF', borderRadius: '6px', height: '28px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: `${h.confidence * 100}%`, height: '100%', background: `${h.color}22`, borderRadius: '6px', transition: 'width 0.5s' }} />
                  <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', fontWeight: 600, color: h.color }}>"{h.token}" ({(h.confidence * 100).toFixed(0)}%)</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setStep(s => Math.min(s + 1, heads.length - 1))} style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: 'none', background: '#C76B4A', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem', marginRight: '0.5rem' }}>
            {step < heads.length - 1 ? 'Predict Next' : 'All Predicted!'}
          </button>
          <button onClick={() => setStep(0)} style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: '1px solid #E5DFD3', background: 'white', color: '#2C3E2D', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem' }}>Reset</button>
          <p style={{ fontSize: '0.8rem', color: '#7A6F5E', marginTop: '1rem', lineHeight: 1.5 }}>
            All {heads.length} predictions happen <strong>in parallel</strong> in a single forward pass. Traditional autoregressive decoding would need {heads.length} sequential passes.
          </p>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {treeNodes.map((node, depth) => (
              <div key={depth} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: `${depth * 2}rem` }}>
                <span style={{ fontSize: '0.75rem', color: '#7A6F5E', width: '55px' }}>Depth {depth}:</span>
                {node.tokens.map((t, j) => (
                  <span key={j} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', padding: '0.3rem 0.7rem', borderRadius: '6px', background: node.accepted[j] ? 'rgba(139,168,136,0.2)' : 'rgba(199,107,74,0.1)', color: node.accepted[j] ? '#2C3E2D' : '#C76B4A', border: `1px solid ${node.accepted[j] ? '#8BA888' : '#E5DFD3'}`, fontWeight: node.accepted[j] ? 600 : 400, textDecoration: node.accepted[j] ? 'none' : 'line-through' }}>
                    {t} {node.accepted[j] ? '\u2713' : '\u2717'}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#7A6F5E', lineHeight: 1.5 }}>
            Verification uses the LM head to check all candidate tokens in parallel. Rejected branches are pruned, accepted tokens form the final sequence.
          </p>
        </>
      )}

      <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(139,168,136,0.08)', borderRadius: '10px', border: '1px solid rgba(139,168,136,0.15)' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.5rem' }}>Speedup Comparison</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#7A6F5E' }}>Autoregressive</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#7A6F5E' }}>{autoSteps} steps</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#8BA888' }}>Medusa</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#8BA888' }}>{medusaSteps} steps</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#C76B4A' }}>Speedup</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#C76B4A' }}>{(autoSteps / medusaSteps).toFixed(1)}x</div>
          </div>
        </div>
      </div>
    </div>
  );
}
