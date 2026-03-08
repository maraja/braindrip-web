import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function ScaleLLE03Gemini2AndBeyond() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u26A1 REAL-WORLD IMPACT</p>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.5, marginBottom: 12 }}>How does Gemini 2.x and 3: Google\'s Agent Era matter in practice?</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #C76B4A', background: 'transparent', color: '#C76B4A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reveal Impact \u2192
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>The Ecosystem Advantage:</strong> No other AI lab can integrate a frontier model with Search, Gmail, Docs, Sheets, Android, Chrome, Maps, and YouTube. Gemini 2.x made this integration real rather than theoretical.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Thinking Models at Every Tier:</strong> Google\'s decision to bring reasoning capabilities to both Pro and Flash tiers was influential. It demonstrated that thinking capabilities need not be reserved for expensive flagship models.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Chatbot Arena and LMArena Competitiveness:</strong> Gemini 2.5 Pro\'s rise to #1 on Chatbot Arena and LMArena — especially in coding, math, and web development — was significant because Arena scores reflect human preference in blind comparisons, not benchmark optimization. It validated Google\'s approach and challenged the narrative that OpenAI and Anthropic were the only frontier competitors.</p>
          </div>
        </div>
      )}
    </div>
  );
}
