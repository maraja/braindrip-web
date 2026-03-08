import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function ScaleLLE06Xlnet() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u26A1 REAL-WORLD IMPACT</p>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.5, marginBottom: 12 }}>How does XLNet: Permutation Language Modeling matter in practice?</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #C76B4A', background: 'transparent', color: '#C76B4A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reveal Impact \u2192
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Resolving the AR-AE Tension:</strong> XLNet was the first model to formally articulate the limitations of both the autoregressive and autoencoding paradigms and propose a principled solution. The pretrain-finetune discrepancy caused by [MASK] tokens was a real problem — BERT never saw [MASK] during fine-tuning, and the 80/10/10 masking ratio was a workaround, not a solution.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Benchmark Dominance — Then Decline:</strong> At the time of release, XLNet outperformed BERT on 20 benchmarks, including SQuAD, GLUE, and several reading comprehension tasks. XLNet-Large achieved 90.5 on SQuAD 2.0 (vs BERT\'s 86.3), 88.4 on GLUE (vs BERT\'s 82.1), and significant improvements on RACE and other reading comprehension tasks.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Lasting Intellectual Contribution:</strong> Even though XLNet was not widely adopted as a production model, its intellectual contributions were significant. The formal analysis of AR vs AE tradeoffs influenced subsequent model design.</p>
          </div>
        </div>
      )}
    </div>
  );
}
