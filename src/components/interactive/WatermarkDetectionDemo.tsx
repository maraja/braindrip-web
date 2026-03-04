import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const SAMPLES = [
  {
    text: 'The advancement of artificial intelligence has transformed numerous industries, enabling unprecedented efficiency and innovation across healthcare, finance, and education sectors worldwide.',
    greenRatio: 0.78, zScore: 4.2, tokens: 24,
    classification: 'AI-Generated',
    explanation: 'z-score of 4.2 far exceeds the threshold of 2.0. The green token ratio of 78% is significantly above the expected 50%, indicating a strong watermark signal.',
  },
  {
    text: 'I went to the store yesterday and bought some milk, bread, and eggs. The cashier was friendly and asked about my day, which was a nice surprise.',
    greenRatio: 0.52, zScore: 0.3, tokens: 28,
    classification: 'Human-Written',
    explanation: 'z-score of 0.3 is well below the threshold of 2.0. The green token ratio of 52% is close to the expected 50% random baseline, indicating no watermark present.',
  },
  {
    text: 'Recent studies in computational linguistics demonstrate that transformer architectures exhibit emergent capabilities when scaled to sufficient parameter counts and training data volumes.',
    greenRatio: 0.71, zScore: 3.1, tokens: 22,
    classification: 'AI-Generated',
    explanation: 'z-score of 3.1 exceeds the detection threshold. The 71% green ratio is elevated but slightly lower than typical — the text may have been lightly edited after generation.',
  },
  {
    text: 'My grandmother always said that the best recipes are the ones passed down through generations. Her apple pie was legendary at every family gathering.',
    greenRatio: 0.48, zScore: -0.2, tokens: 26,
    classification: 'Human-Written',
    explanation: 'z-score of -0.2 indicates no watermark. The 48% green ratio is slightly below 50%, consistent with natural random variation in human text.',
  },
];

export default function WatermarkDetectionDemo() {
  const [sampleIdx, setSampleIdx] = useState(0);
  const [detected, setDetected] = useState(false);
  const sample = SAMPLES[sampleIdx];
  const isAI = sample.classification === 'AI-Generated';

  const switchSample = (i: number) => { setSampleIdx(i); setDetected(false); };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Watermark Detection</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Analyze text for watermarks using z-score statistical testing.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem', flexWrap: 'wrap' as const }}>
        {SAMPLES.map((_, i) => (
          <button key={i} onClick={() => switchSample(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: '1px solid #E5DFD3', cursor: 'pointer',
            background: sampleIdx === i ? '#2C3E2D' : 'transparent', color: sampleIdx === i ? '#FDFBF7' : '#5A6B5C',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: 600,
          }}>Sample {i + 1}</button>
        ))}
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.3rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Text to Analyze</div>
        <div style={{ fontSize: '0.88rem', color: '#2C3E2D', lineHeight: 1.7, fontStyle: 'italic' }}>"{sample.text}"</div>
      </div>

      <button onClick={() => setDetected(true)} disabled={detected} style={{
        width: '100%', padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: detected ? 'default' : 'pointer',
        background: detected ? '#C5BFB3' : '#2C3E2D', color: '#FDFBF7', fontFamily: "'Source Sans 3', system-ui, sans-serif",
        fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem',
      }}>Run Detection</button>

      {detected && (
        <>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', background: '#F5F0E6', textAlign: 'center' as const }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: sample.zScore > 2 ? '#C76B4A' : '#8BA888' }}>{sample.zScore.toFixed(1)}</div>
              <div style={{ fontSize: '0.68rem', color: '#8B9B8D' }}>z-score</div>
            </div>
            <div style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', background: '#F5F0E6', textAlign: 'center' as const }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: sample.greenRatio > 0.6 ? '#C76B4A' : '#8BA888' }}>{(sample.greenRatio * 100).toFixed(0)}%</div>
              <div style={{ fontSize: '0.68rem', color: '#8B9B8D' }}>Green ratio</div>
            </div>
            <div style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', background: '#F5F0E6', textAlign: 'center' as const }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#2C3E2D' }}>{sample.tokens}</div>
              <div style={{ fontSize: '0.68rem', color: '#8B9B8D' }}>Tokens</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', padding: '0.6rem 0.85rem', borderRadius: '8px', background: isAI ? '#C76B4A10' : '#8BA88810', border: `1px solid ${isAI ? '#C76B4A33' : '#8BA88833'}` }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: isAI ? '#C76B4A' : '#8BA888' }} />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isAI ? '#C76B4A' : '#8BA888' }}>{sample.classification}</span>
            <span style={{ fontSize: '0.78rem', color: '#5A6B5C', marginLeft: '0.25rem' }}>(threshold: z &gt; 2.0)</span>
          </div>

          <div style={{ padding: '0.85rem', background: '#F5F0E6', borderRadius: '10px', fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.7 }}>{sample.explanation}</div>
        </>
      )}
    </div>
  );
}
