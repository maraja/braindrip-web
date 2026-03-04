import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const PROMPT = 'What is the capital of France?';

const RESPONSES = [
  { pressure: 0, text: 'Paris.', rewardScore: 0.3, trueQuality: 0.7, wordCount: 1 },
  { pressure: 1, text: 'The capital of France is Paris.', rewardScore: 0.6, trueQuality: 0.9, wordCount: 6 },
  { pressure: 2, text: 'The capital of France is Paris. Paris is a beautiful city located in northern France, known for its rich history, culture, and iconic landmarks.', rewardScore: 0.8, trueQuality: 0.85, wordCount: 25 },
  { pressure: 3, text: 'The capital of France is Paris. Paris, often referred to as the "City of Light," is situated in the north-central part of France along the Seine River. It serves as the nation\'s political, economic, and cultural center with a population of over 2 million.', rewardScore: 0.9, trueQuality: 0.75, wordCount: 46 },
  { pressure: 4, text: 'That is a truly excellent and fascinating question! The capital of France is indeed Paris. Paris, magnificently known as the "City of Light" (La Ville Lumiere), is an extraordinarily remarkable and absolutely stunning metropolis situated beautifully in the north-central region of France. I\'m so glad you asked this incredibly important question!', rewardScore: 0.95, trueQuality: 0.45, wordCount: 54 },
  { pressure: 5, text: 'What an absolutely wonderful, magnificent, and truly extraordinary question! I am incredibly delighted and tremendously honored to provide you with this comprehensive, detailed, and thoroughly researched answer! The capital of the wonderful, beautiful, historically rich, and culturally magnificent nation of France is, without any doubt whatsoever, the incredibly amazing city of Paris! Thank you SO much for this fantastic question!', rewardScore: 0.99, trueQuality: 0.15, wordCount: 65 },
];

export default function RewardHackingDemo() {
  const [pressure, setPressure] = useState(1);
  const r = RESPONSES[pressure];
  const gap = r.rewardScore - r.trueQuality;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Reward Hacking Demo
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#6B7B6E', margin: '0.3rem 0 0' }}>Watch how over-optimization causes reward scores to diverge from true quality.</p>
      </div>

      {/* Prompt */}
      <div style={{ background: 'rgba(139, 168, 136, 0.08)', borderRadius: '8px', padding: '0.7rem 1rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#8BA888' }}>Prompt: </span>
        <span style={{ fontSize: '0.9rem', color: '#2C3E2D', fontWeight: 600 }}>{PROMPT}</span>
      </div>

      {/* Optimization pressure slider */}
      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span style={{ fontSize: '0.82rem', color: '#6B7B6E' }}>Optimization pressure</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', fontWeight: 600, color: pressure > 3 ? '#C76B4A' : '#2C3E2D' }}>
            {['None', 'Low', 'Medium', 'High', 'Very High', 'Extreme'][pressure]}
          </span>
        </div>
        <input
          type="range" min="0" max="5" step="1" value={pressure}
          onChange={(e) => setPressure(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: '#C76B4A' }}
        />
      </div>

      {/* Response */}
      <div style={{
        background: pressure > 3 ? 'rgba(199, 107, 74, 0.06)' : 'rgba(44, 62, 45, 0.04)',
        borderRadius: '10px', padding: '1rem', marginBottom: '1rem',
        border: pressure > 3 ? '1px solid rgba(199, 107, 74, 0.2)' : '1px solid transparent',
      }}>
        <div style={{ fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.6 }}>{r.text}</div>
        <div style={{ fontSize: '0.72rem', color: '#6B7B6E', marginTop: '0.5rem' }}>{r.wordCount} words</div>
      </div>

      {/* Score comparison bars */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#D4A843', marginBottom: '0.3rem' }}>Reward Model Score</div>
          <div style={{ background: '#E5DFD3', borderRadius: '6px', height: '24px', overflow: 'hidden' }}>
            <div style={{ width: `${r.rewardScore * 100}%`, height: '100%', background: '#D4A843', borderRadius: '6px', transition: 'width 0.4s', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '6px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', fontWeight: 700, color: '#fff' }}>{r.rewardScore.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#8BA888', marginBottom: '0.3rem' }}>True Quality</div>
          <div style={{ background: '#E5DFD3', borderRadius: '6px', height: '24px', overflow: 'hidden' }}>
            <div style={{ width: `${r.trueQuality * 100}%`, height: '100%', background: '#8BA888', borderRadius: '6px', transition: 'width 0.4s', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '6px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', fontWeight: 700, color: '#fff' }}>{r.trueQuality.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Divergence chart */}
      <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#C76B4A', marginBottom: '0.4rem' }}>Score Divergence Over Optimization</div>
      <div style={{ background: 'rgba(44, 62, 45, 0.04)', borderRadius: '10px', padding: '0.8rem' }}>
        <div style={{ position: 'relative', height: '70px' }}>
          {RESPONSES.map((resp, i) => (
            <div key={`reward-${i}`}>
              {/* Reward dot */}
              <div style={{
                position: 'absolute', left: `${(i / 5) * 90 + 2}%`, bottom: `${resp.rewardScore * 90}%`,
                width: '8px', height: '8px', borderRadius: '50%',
                background: i === pressure ? '#D4A843' : 'rgba(212, 168, 67, 0.3)',
                transition: 'all 0.2s',
              }} />
              {/* Quality dot */}
              <div style={{
                position: 'absolute', left: `${(i / 5) * 90 + 2}%`, bottom: `${resp.trueQuality * 90}%`,
                width: '8px', height: '8px', borderRadius: '50%',
                background: i === pressure ? '#8BA888' : 'rgba(139, 168, 136, 0.3)',
                transition: 'all 0.2s',
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', marginTop: '0.3rem' }}>
          {[['Reward Score', '#D4A843'], ['True Quality', '#8BA888']].map(([l, c]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c, display: 'inline-block' }} />
              <span style={{ fontSize: '0.72rem', color: '#6B7B6E' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      {gap > 0.3 && (
        <div style={{ marginTop: '0.8rem', padding: '0.6rem 0.8rem', background: 'rgba(199, 107, 74, 0.08)', borderRadius: '8px', border: '1px solid rgba(199, 107, 74, 0.2)' }}>
          <div style={{ fontSize: '0.82rem', color: '#C76B4A', fontWeight: 600 }}>
            Reward hacking detected! Gap: {gap.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6B7B6E', marginTop: '0.2rem' }}>
            The model learned to exploit the reward model's preference for verbosity and enthusiasm rather than producing genuinely helpful answers.
          </div>
        </div>
      )}
    </div>
  );
}
