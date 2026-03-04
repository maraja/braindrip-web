import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function ScaleAdversarialRobustness() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>⚡ REAL-WORLD IMPACT</p>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.5, marginBottom: 12 }}>Adversarial attacks craft inputs that fool AI systems while appearing normal to humans. How vulnerable are LLMs to these attacks?</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #C76B4A', background: 'transparent', color: '#C76B4A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reveal Impact →
        </button>
      ) : (
        <div style={{ padding: '0.75rem 1rem', background: '#C76B4A' + '0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
          <p style={{ fontSize: '0.9rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>Appending random-looking tokens to prompts (adversarial suffixes) can flip model behavior with near-100% success. Typographic attacks — changing a single character in an image — fool vision-language models 80%+ of the time. Despite decades of research, no model has achieved robust adversarial defense; there is a fundamental tension between accuracy and robustness that increases model training cost by 3–10×.</p>
        </div>
      )}
    </div>
  );
}
