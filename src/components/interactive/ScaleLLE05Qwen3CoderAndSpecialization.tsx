import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function ScaleLLE05Qwen3CoderAndSpecialization() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u26A1 REAL-WORLD IMPACT</p>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.5, marginBottom: 12 }}>How does Qwen 3 Coder: Domain-Specialized Open Models matter in practice?</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #C76B4A', background: 'transparent', color: '#C76B4A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reveal Impact \u2192
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Specialization as Strategy:</strong> Qwen3-Coder demonstrates that open models do not need to match frontier closed models on every dimension to be valuable. By concentrating capability in a single domain, an open model can achieve near-parity with the best closed models on that domain\'s tasks.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>The Broader Specialization Trend:</strong> Qwen3-Coder is one instance of a pattern. Alibaba has also released specialized variants for mathematics (Qwen-Math), visual understanding (Qwen-VL), and audio processing (Qwen-Audio).</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Open-Weight Accessibility:</strong> Released under Apache 2.0, Qwen3-Coder can be freely used, modified, and deployed by anyone. This means small companies, individual developers, and organizations in sensitive industries (healthcare, defense, finance) can run a frontier-competitive coding model on their own infrastructure, with full control over data privacy and no per-query API costs.</p>
          </div>
        </div>
      )}
    </div>
  );
}
