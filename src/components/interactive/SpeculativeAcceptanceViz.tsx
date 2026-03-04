import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

type DraftQuality = 'high' | 'medium' | 'low';

const tokenData: Record<DraftQuality, { token: string; draftP: number; targetP: number }[]> = {
  high: [
    { token: 'Paris', draftP: 0.82, targetP: 0.88 },
    { token: 'is', draftP: 0.91, targetP: 0.93 },
    { token: 'the', draftP: 0.88, targetP: 0.90 },
    { token: 'capital', draftP: 0.79, targetP: 0.85 },
    { token: 'of', draftP: 0.94, targetP: 0.95 },
    { token: 'France', draftP: 0.86, targetP: 0.91 },
  ],
  medium: [
    { token: 'Paris', draftP: 0.65, targetP: 0.88 },
    { token: 'is', draftP: 0.78, targetP: 0.93 },
    { token: 'a', draftP: 0.55, targetP: 0.30 },
    { token: 'beautiful', draftP: 0.42, targetP: 0.18 },
    { token: 'of', draftP: 0.72, targetP: 0.95 },
    { token: 'France', draftP: 0.60, targetP: 0.91 },
  ],
  low: [
    { token: 'London', draftP: 0.40, targetP: 0.05 },
    { token: 'was', draftP: 0.35, targetP: 0.12 },
    { token: 'the', draftP: 0.62, targetP: 0.90 },
    { token: 'biggest', draftP: 0.28, targetP: 0.08 },
    { token: 'in', draftP: 0.50, targetP: 0.65 },
    { token: 'Europe', draftP: 0.33, targetP: 0.15 },
  ],
};

function getAcceptance(draftP: number, targetP: number): { accepted: boolean; prob: number; rule: string } {
  if (draftP <= targetP) {
    return { accepted: true, prob: 1.0, rule: 'Always accept: q(x) \u2264 p(x)' };
  }
  const acceptProb = targetP / draftP;
  // Deterministic for visualization: accept if prob > 0.5
  return { accepted: acceptProb > 0.5, prob: acceptProb, rule: `Accept with prob p(x)/q(x) = ${acceptProb.toFixed(2)}` };
}

const qualityLabels: Record<DraftQuality, { label: string; color: string; rate: string }> = {
  high: { label: '7B draft (well-matched)', color: '#8BA888', rate: '~95%' },
  medium: { label: '1.5B draft (moderate)', color: '#D4A843', rate: '~65%' },
  low: { label: '125M draft (weak)', color: '#C76B4A', rate: '~30%' },
};

export default function SpeculativeAcceptanceViz() {
  const [quality, setQuality] = useState<DraftQuality>('high');
  const data = tokenData[quality];
  const q = qualityLabels[quality];

  const acceptances = data.map(d => getAcceptance(d.draftP, d.targetP));
  const acceptRate = Math.round((acceptances.filter(a => a.accepted).length / acceptances.length) * 100);
  const avgSpeedup = (1 / (1 - acceptRate / 100 * 0.8)).toFixed(1);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Speculative Acceptance Mechanism
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          See how draft vs target probabilities determine token acceptance. Better draft models mean higher acceptance rates.
        </p>
      </div>

      {/* Quality selector */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {(['high', 'medium', 'low'] as const).map(k => (
          <button key={k} onClick={() => setQuality(k)} style={{
            padding: '0.4rem 0.85rem', borderRadius: '6px', cursor: 'pointer',
            border: `1px solid ${quality === k ? qualityLabels[k].color : '#E5DFD3'}`,
            background: quality === k ? `${qualityLabels[k].color}12` : 'transparent',
            color: quality === k ? qualityLabels[k].color : '#5A6B5C',
            fontWeight: quality === k ? 600 : 400, fontSize: '0.75rem',
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>
            {qualityLabels[k].label}
          </button>
        ))}
      </div>

      {/* Token-by-token comparison */}
      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '65px 1fr 1fr 70px 55px', gap: '0.4rem', alignItems: 'center', marginBottom: '0.4rem' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600 }}>Token</div>
          <div style={{ fontSize: '0.6rem', color: '#D4A843', fontWeight: 600 }}>Draft q(x)</div>
          <div style={{ fontSize: '0.6rem', color: '#8BA888', fontWeight: 600 }}>Target p(x)</div>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600 }}>Accept P</div>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textAlign: 'center' }}>Result</div>
        </div>
        {data.map((d, i) => {
          const a = acceptances[i];
          const maxP = Math.max(d.draftP, d.targetP);
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '65px 1fr 1fr 70px 55px', gap: '0.4rem', alignItems: 'center',
              padding: '0.35rem 0', borderTop: i > 0 ? '1px solid rgba(229,223,211,0.5)' : 'none',
            }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#2C3E2D', fontWeight: 600 }}>
                {d.token}
              </span>
              {/* Draft bar */}
              <div style={{ position: 'relative', height: '18px' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(229,223,211,0.5)', borderRadius: '3px' }} />
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: '3px',
                  width: `${(d.draftP / maxP) * 100}%`, background: '#D4A843',
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '4px',
                }}>
                  <span style={{ fontSize: '0.55rem', color: '#fff', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                    {d.draftP.toFixed(2)}
                  </span>
                </div>
              </div>
              {/* Target bar */}
              <div style={{ position: 'relative', height: '18px' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(229,223,211,0.5)', borderRadius: '3px' }} />
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: '3px',
                  width: `${(d.targetP / maxP) * 100}%`, background: '#8BA888',
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '4px',
                }}>
                  <span style={{ fontSize: '0.55rem', color: '#fff', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                    {d.targetP.toFixed(2)}
                  </span>
                </div>
              </div>
              {/* Accept probability */}
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: a.prob >= 1 ? '#8BA888' : a.prob > 0.5 ? '#D4A843' : '#C76B4A', fontWeight: 600 }}>
                {a.prob >= 1 ? '100%' : `${(a.prob * 100).toFixed(0)}%`}
              </span>
              {/* Result */}
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, textAlign: 'center', borderRadius: '4px',
                padding: '0.15rem 0.3rem',
                color: a.accepted ? '#8BA888' : '#C76B4A',
                background: a.accepted ? 'rgba(139,168,136,0.1)' : 'rgba(199,107,74,0.08)',
              }}>
                {a.accepted ? '\u2713 accept' : '\u2717 reject'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Acceptance rule explanation */}
      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.68rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Acceptance Rule</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div style={{ padding: '0.5rem', background: '#FDFBF7', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#8BA888', marginBottom: '0.15rem' }}>Case 1: q(x) {'\u2264'} p(x)</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: '#5A6B5C' }}>
              Always accept. The draft model underestimates -- safe to keep.
            </div>
          </div>
          <div style={{ padding: '0.5rem', background: '#FDFBF7', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#D4A843', marginBottom: '0.15rem' }}>Case 2: q(x) {'>'} p(x)</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: '#5A6B5C' }}>
              Accept with probability p(x)/q(x). The draft overestimates -- probabilistic rejection corrects the distribution.
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.65rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.58rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Accept Rate</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: q.color }}>{acceptRate}%</div>
        </div>
        <div style={{ padding: '0.65rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.58rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Est. Speedup</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#D4A843' }}>{avgSpeedup}x</div>
        </div>
        <div style={{ padding: '0.65rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.58rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Typical Rate</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#5A6B5C' }}>{q.rate}</div>
        </div>
      </div>

      <div style={{ padding: '0.75rem 1rem', background: 'rgba(199, 107, 74, 0.06)', borderRadius: '8px', borderLeft: `3px solid ${q.color}`, fontSize: '0.78rem', color: '#5A6B5C', lineHeight: 1.6 }}>
        {quality === 'high' && 'A well-matched draft model (7B for a 70B target) achieves ~95% acceptance. Since draft probabilities closely track target probabilities, most tokens pass the acceptance test. This yields 3-5x speedup.'}
        {quality === 'medium' && 'A moderate draft model shows mixed results. Some tokens align well (common words) while others diverge (content-specific predictions). The acceptance rate of ~65% still provides meaningful speedup.'}
        {quality === 'low' && 'A weak draft model frequently overestimates probabilities on wrong tokens. The probabilistic rejection mechanism correctly filters these, but the low acceptance rate (~30%) means little speedup -- most tokens are resampled.'}
      </div>
    </div>
  );
}
