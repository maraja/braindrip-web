import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function ScalePEStepBackPrompting() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u26A1 REAL-WORLD IMPACT</p>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.5, marginBottom: 12 }}>How does Step-Back Prompting matter in practice?</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #C76B4A', background: 'transparent', color: '#C76B4A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reveal Impact \u2192
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Reducing Conceptual Errors:</strong> Many LLM errors are not computational mistakes but conceptual ones: the model applies the wrong principle, confuses related concepts, or fails to recognize the type of problem. Step-back prompting directly addresses these errors by forcing explicit principle identification before solution.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Expert-Like Reasoning Patterns:</strong> Step-back prompting aligns LLM behavior with expert cognitive patterns documented in the problem-solving literature. Experts in physics, for example, categorize problems by deep structure (conservation of energy, Newton\'s laws) while novices categorize by surface features (inclined planes, pulleys).</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Improved Grounding for Complex Problems:</strong> For problems that require integrating multiple pieces of knowledge, the step-back phase ensures the model retrieves the right conceptual framework before attempting integration. Without this grounding, the model may generate a plausible-sounding but fundamentally misframed solution.</p>
          </div>
        </div>
      )}
    </div>
  );
}
