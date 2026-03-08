import { useState } from 'react';

const STEPS = [
    { title: '1. The Arcade Learning Environment (ALE)', desc: 'The experimental platform was the Arcade Learning Environment (Bellemare et al., 2013), a standardized interface to Atari 2600 game ROMs. ALE provides a uniform API: the agent receives a 210 x 160 RGB image at 60 Hz and selects from up to 18 discrete joystick actions.' },
    { title: '2. Raw Pixel Preprocessing', desc: 'Raw frames undergo a pipeline before reaching the network:  Grayscale conversion -- reduces 210 x 160 x 3 RGB to 210 x 160 x 1 Downsampling -- rescaled to 84 x 84 pixels Frame stacking -- the last 4 frames are stacked into an 84 x 84 x 4 input tensor  Frame stacking is critical: a single frame.' },
    { title: '3. The DQN Architecture', desc: 'The network maps the 84 x 84 x 4 input to Q-values for each possible action:  Conv layer 1: 32 filters, 8 x 8 kernel, stride 4, ReLU Conv layer 2: 64 filters, 4 x 4 kernel, stride 2, ReLU Conv layer 3: 64 filters, 3 x 3 kernel, stride 1, ReLU Fully connected: 512 units, ReLU Output: one Q-value per.' },
    { title: '4. Two Key Stability Innovations', desc: 'DQN\'s success hinged on solving the instabilities of combining neural networks with Q-learning (the "deadly triad" from function-approximation.md):  Experience replay (see experience-replay.md): Transitions (s, a, r, s\') are stored in a replay buffer of size 10^6.' },
    { title: '5. Training Details', desc: 'Optimizer: RMSProp with learning rate 2.5 x 10^&#123;-4&#125; Exploration: -greedy with  annealed from 1.0 to 0.1 over 1 million frames Discount factor:  = 0.99 Training duration: 50 million frames per game (~38 days of real-time play, ~8-10 days on 2015-era GPUs) Frame skipping: the agent sees every 4th.' },
];

export default function WalkthroughRLAtariAndArcadeGames() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive Walkthrough</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Atari and Arcade Games \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how atari and arcade games works, one stage at a time.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem' }}>
        {STEPS.map((_, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: i <= step ? '#C76B4A' : '#E5DFD3',
            border: 'none', cursor: 'pointer', transition: 'background 0.2s ease',
          }} />
        ))}
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.05rem', fontWeight: 600, color: '#2C3E2D', margin: '0 0 0.4rem 0' }}>
          {current.title}
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: 0 }}>
          {current.desc}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
          padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid #E5DFD3',
          background: step === 0 ? '#F5F0E8' : '#FDFBF7', color: step === 0 ? '#B0A898' : '#5A6B5C',
          fontSize: '0.8rem', cursor: step === 0 ? 'default' : 'pointer', fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>
          &#8592; Previous
        </button>
        <span style={{ fontSize: '0.75rem', color: '#7A8B7C', fontFamily: "'JetBrains Mono', monospace" }}>
          {step + 1} / {STEPS.length}
        </span>
        <button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} disabled={step === STEPS.length - 1} style={{
          padding: '0.4rem 1rem', borderRadius: '6px',
          border: `1px solid ${step === STEPS.length - 1 ? '#E5DFD3' : '#C76B4A'}`,
          background: step === STEPS.length - 1 ? '#F5F0E8' : 'rgba(199, 107, 74, 0.08)',
          color: step === STEPS.length - 1 ? '#B0A898' : '#C76B4A',
          fontSize: '0.8rem', fontWeight: 500, cursor: step === STEPS.length - 1 ? 'default' : 'pointer',
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>
          Next &#8594;
        </button>
      </div>
    </div>
  );
}
