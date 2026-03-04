import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const prompts = [
  { text: 'The future of AI is', label: 'Open-ended' },
  { text: 'The capital of France is', label: 'Factual' },
  { text: 'Once upon a time in a', label: 'Creative' },
];

const outputs: Record<string, Record<string, string[]>> = {
  'The future of AI is': {
    greedy: ['promising, with advances in reasoning, multimodal understanding, and safety alignment driving the next wave of innovation.'],
    beam: ['promising, with significant advances expected in both capability and safety.', 'uncertain, but the trajectory points toward increasingly capable and general systems.'],
    'top-p': ['a tapestry woven from brilliant threads of human ingenuity and machine precision.', 'something that keeps me up at night -- in the best possible way.', 'not about replacing humans, but amplifying what makes us uniquely creative.'],
    temperature: ['WILDLY unpredictable, like a jazz musician who learned physics!', 'going to reshape the cosmic ballet of civilization itself.', 'a question that makes philosophers and engineers equally nervous.'],
  },
  'The capital of France is': {
    greedy: ['Paris, which has served as the political and cultural center of France for centuries.'],
    beam: ['Paris, a city renowned for its art, culture, and history.', 'Paris, located along the Seine River in northern France.'],
    'top-p': ['Paris -- the City of Light that has illuminated Western culture for millennia.', 'Paris, home to the Eiffel Tower and countless cafes.'],
    temperature: ['Paris! But honestly, every French village thinks it should be.', 'technically Paris, but spiritually it might be Lyon if you ask any chef.'],
  },
  'Once upon a time in a': {
    greedy: ['land far away, there lived a young princess who dreamed of exploring the world beyond her castle walls.'],
    beam: ['distant kingdom, there lived a wise ruler who governed with fairness and compassion.', 'small village nestled between mountains, an unusual child was born.'],
    'top-p': ['forgotten corner of the universe, a star learned to sing.', 'library that existed between seconds, a librarian catalogued every dream ever dreamed.', 'world made entirely of music, silence was the rarest treasure.'],
    temperature: ['teacup orbiting Neptune, a philosophical octopus debated the meaning of dry land.', 'dimension where gravity was optional, shoes became the most controversial invention.'],
  },
};

const strategies = [
  { key: 'greedy', label: 'Greedy', color: '#2C3E2D', desc: 'Always picks the highest probability token. Deterministic but repetitive.' },
  { key: 'beam', label: 'Beam Search', color: '#D4A843', desc: 'Explores multiple candidates simultaneously, keeping the top-k sequences.' },
  { key: 'top-p', label: 'Top-P (0.9)', color: '#8BA888', desc: 'Samples from the smallest set of tokens whose cumulative probability exceeds p.' },
  { key: 'temperature', label: 'Temp (1.5)', color: '#C76B4A', desc: 'High temperature flattens the distribution, increasing creativity and randomness.' },
];

export default function SamplingComparison() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState(0);
  const prompt = prompts[promptIdx];
  const strat = strategies[selectedStrategy];
  const results = outputs[prompt.text][strat.key];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Sampling Strategy Comparison
        </h3>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#7A6F5E', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Prompt</div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {prompts.map((p, i) => (
            <button key={i} onClick={() => setPromptIdx(i)} style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: promptIdx === i ? '2px solid #C76B4A' : '1px solid #E5DFD3', background: promptIdx === i ? 'rgba(199,107,74,0.08)' : 'white', color: '#2C3E2D', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: promptIdx === i ? 600 : 400 }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: '#2C3E2D', padding: '0.6rem 0.8rem', background: '#EDE9DF', borderRadius: '8px', marginBottom: '1.25rem' }}>
        "{prompt.text}..."
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {strategies.map((s, i) => (
          <button key={i} onClick={() => setSelectedStrategy(i)} style={{ flex: 1, padding: '0.5rem 0.4rem', borderRadius: '8px', border: selectedStrategy === i ? `2px solid ${s.color}` : '1px solid #E5DFD3', background: selectedStrategy === i ? `${s.color}10` : 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: selectedStrategy === i ? 700 : 400, color: '#2C3E2D' }}>
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ fontSize: '0.78rem', color: '#7A6F5E', marginBottom: '1rem', lineHeight: 1.5, padding: '0.5rem 0.75rem', background: `${strat.color}08`, borderRadius: '8px', borderLeft: `3px solid ${strat.color}` }}>
        {strat.desc}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {results.map((r, i) => (
          <div key={i} style={{ padding: '0.7rem 0.9rem', background: 'white', borderRadius: '8px', border: '1px solid #E5DFD3', fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.6 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: strat.color, fontWeight: 600, marginRight: '0.5rem' }}>
              {results.length > 1 ? `#${i + 1}` : 'Output'}
            </span>
            {r}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const }}>
        {[{ label: 'Determinism', values: [100, 85, 40, 15] }, { label: 'Creativity', values: [10, 30, 70, 95] }].map((metric) => (
          <div key={metric.label} style={{ flex: '1 1 45%', padding: '0.6rem', background: 'rgba(139,168,136,0.08)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#7A6F5E', marginBottom: '0.4rem' }}>{metric.label}</div>
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'flex-end', height: '30px' }}>
              {strategies.map((s, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem' }}>
                  <div style={{ width: '100%', height: `${metric.values[i] * 0.28}px`, background: selectedStrategy === i ? s.color : '#E5DFD3', borderRadius: '3px', transition: 'all 0.3s' }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
