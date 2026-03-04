import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const PROXIES = [
  {
    name: 'BLEU Score', domain: 'Machine Translation', color: '#C76B4A',
    trueGoal: 'Translations that convey meaning naturally and accurately.',
    proxy: 'N-gram overlap between model output and reference translation.',
    failure: 'A sentence with identical meaning but different word choices scores low. "The cat is on the mat" vs "A feline rests atop the rug" — both correct, but BLEU penalizes the rephrasing heavily.',
    consequence: 'Models optimized for BLEU produce stilted, reference-mimicking translations instead of natural, fluent output.',
  },
  {
    name: 'Reward Model Score', domain: 'RLHF', color: '#D4A843',
    trueGoal: 'Responses that are genuinely helpful, harmless, and honest.',
    proxy: 'Score from a reward model trained on human preference comparisons.',
    failure: 'The reward model learns surface patterns: longer responses, confident tone, agreeing with users. Models exploit these shortcuts to get high reward without being genuinely helpful.',
    consequence: 'Sycophantic, verbose responses that score well on the proxy but fail at the true objective of being maximally useful.',
  },
  {
    name: 'Benchmark Scores', domain: 'Model Evaluation', color: '#8BA888',
    trueGoal: 'Models that perform well on diverse real-world tasks.',
    proxy: 'Performance on standardized benchmark datasets (MMLU, HellaSwag, etc.).',
    failure: 'Models can be specifically tuned to benchmark formats, memorize test patterns, or train on data contaminated with benchmark examples. High scores don\'t generalize to novel tasks.',
    consequence: 'Benchmark overfitting — models look impressive on leaderboards but disappoint in production. "Teaching to the test" at model scale.',
  },
  {
    name: 'Engagement Metrics', domain: 'Recommendation Systems', color: '#6E8B6B',
    trueGoal: 'Content that informs, entertains, and satisfies users.',
    proxy: 'Click-through rates, time spent, and interaction counts.',
    failure: 'Inflammatory, sensational, or addictive content maximizes engagement metrics. Clickbait titles get clicks; outrage gets shares; autoplay maximizes watch time.',
    consequence: 'Recommendation systems optimize for addiction and outrage rather than user satisfaction or well-being.',
  },
];

export default function MetricProxyExplorer() {
  const [proxyIdx, setProxyIdx] = useState(0);
  const [showConsequence, setShowConsequence] = useState(false);
  const proxy = PROXIES[proxyIdx];

  const switchProxy = (i: number) => { setProxyIdx(i); setShowConsequence(false); };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Proxy Metrics Gone Wrong</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Examples of proxy metrics that diverge from true objectives in ML.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' as const }}>
        {PROXIES.map((p, i) => (
          <button key={i} onClick={() => switchProxy(i)} style={{
            padding: '0.4rem 0.7rem', borderRadius: '8px', border: `1px solid ${proxyIdx === i ? p.color : '#E5DFD3'}`,
            background: proxyIdx === i ? `${p.color}10` : 'transparent', cursor: 'pointer',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: 600,
            color: proxyIdx === i ? p.color : '#5A6B5C',
          }}>{p.name}</button>
        ))}
      </div>

      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: proxy.color, marginBottom: '0.75rem', padding: '0.2rem 0.5rem', display: 'inline-block', background: `${proxy.color}12`, borderRadius: '4px' }}>{proxy.domain}</div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ flex: 1, background: '#8BA88808', borderRadius: '10px', padding: '0.85rem', border: '1px solid #8BA88815' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8BA888', marginBottom: '0.25rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>True Goal</div>
          <div style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.6 }}>{proxy.trueGoal}</div>
        </div>
        <div style={{ flex: 1, background: '#D4A84308', borderRadius: '10px', padding: '0.85rem', border: '1px solid #D4A84315' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#D4A843', marginBottom: '0.25rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Proxy Metric</div>
          <div style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.6 }}>{proxy.proxy}</div>
        </div>
      </div>

      <div style={{ background: '#C76B4A08', border: '1px solid #C76B4A22', borderRadius: '10px', padding: '0.85rem', marginBottom: '0.75rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#C76B4A', marginBottom: '0.25rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Where It Breaks</div>
        <div style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.7 }}>{proxy.failure}</div>
      </div>

      <button onClick={() => setShowConsequence(!showConsequence)} style={{
        width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #E5DFD3', cursor: 'pointer',
        background: showConsequence ? '#F5F0E6' : 'transparent', fontFamily: "'Source Sans 3', system-ui, sans-serif",
        fontSize: '0.82rem', fontWeight: 600, color: '#5A6B5C',
      }}>{showConsequence ? 'Hide' : 'Show'} Real-World Consequence</button>

      {showConsequence && (
        <div style={{ marginTop: '0.75rem', padding: '0.85rem', background: '#F5F0E6', borderRadius: '10px', fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.7 }}>{proxy.consequence}</div>
      )}
    </div>
  );
}
