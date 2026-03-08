import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function ScaleLLE02Gemini15() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u26A1 REAL-WORLD IMPACT</p>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.5, marginBottom: 12 }}>How does Gemini 1.5 matter in practice?</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #C76B4A', background: 'transparent', color: '#C76B4A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reveal Impact \u2192
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Long Context as a Strategic Differentiator:</strong> Gemini 1.5 established long context as Google\'s primary competitive moat. While other labs focused on reasoning benchmarks, Google argued that the ability to process entire documents, codebases, or media libraries in a single prompt unlocked fundamentally new capabilities.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>The MoE Efficiency Advantage:</strong> By demonstrating that a Mixture of Experts model could match or exceed dense model performance at lower inference cost, Gemini 1.5 validated the MoE approach for frontier models. This was an important data point in the architecture debate: DeepSeek (see 01-deepseek-v2-and-mla.md) and others would soon push MoE efficiency even further, but Gemini 1.5 showed a major lab successfully deploying MoE at the frontier scale.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Redefining What Fits in a Prompt:</strong> Before Gemini 1.5, prompt engineering was often about compression — how to squeeze enough context into a limited window. After Gemini 1.5, the question shifted to curation — what information is worth including when you can include nearly everything?</p>
          </div>
        </div>
      )}
    </div>
  );
}
