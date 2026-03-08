import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function ScaleAACTrustBoundaries() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u26A1 REAL-WORLD IMPACT</p>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.5, marginBottom: 12 }}>How does Trust Boundaries matter in practice?</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #C76B4A', background: 'transparent', color: '#C76B4A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reveal Impact \u2192
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Defending Against Indirect Prompt Injection:</strong> Indirect prompt injection -- where adversarial instructions are embedded in documents, web pages, or tool outputs -- is the most dangerous attack against agents. Trust boundaries are the primary architectural defense: by treating external content as low-trust data (not instructions), the agent does not execute commands found in that content.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Principled Information Weighting:</strong> Even without adversarial intent, different sources have different reliability. A company\'s internal database is more reliable about customer data than a web search result.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Auditability and Compliance:</strong> Trust boundaries create clear documentation of how different information sources influence agent behavior. Auditors can verify that critical decisions are driven by high-trust data, that low-trust sources cannot override safety constraints, and that the trust hierarchy aligns with organizational policies and regulatory requirements.</p>
          </div>
        </div>
      )}
    </div>
  );
}
