import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function ScaleLLE05Electra() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u26A1 REAL-WORLD IMPACT</p>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.5, marginBottom: 12 }}>How does ELECTRA: Efficiently Learning an Encoder That Classifies Token Replacements Accurately matter in practice?</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #C76B4A', background: 'transparent', color: '#C76B4A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reveal Impact \u2192
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Democratizing Pre-training:</strong> ELECTRA\'s 4x compute efficiency meant that researchers with limited budgets could pre-train competitive models. ELECTRA-Small, with only 14 million parameters, matched GPT-1\'s performance (which required significantly more compute to train).</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Influencing the Efficiency Research Agenda:</strong> ELECTRA demonstrated that the choice of pre-training objective has a massive impact on training efficiency — and that MLM was far from optimal. This finding inspired a line of research into more efficient pre-training: 04-deberta.md V3 adopted replaced token detection, the UL2 framework explored combinations of objectives, and efficiency-focused work increasingly questioned whether standard MLM was the right default.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>The "All Tokens" Principle:</strong> ELECTRA\'s core insight — that training signal should come from all tokens, not a sparse subset — became an influential design principle. Subsequent work explored variants: denoising objectives that corrupt all tokens, contrastive objectives that learn from every position, and multi-task objectives that combine dense and sparse signals.</p>
          </div>
        </div>
      )}
    </div>
  );
}
