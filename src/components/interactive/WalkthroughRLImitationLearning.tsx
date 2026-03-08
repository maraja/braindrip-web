import { useState } from 'react';

const STEPS = [
    { title: '1. Behavioral Cloning', desc: 'Behavioral cloning (BC) treats imitation as supervised learning. Given a dataset of expert state-action pairs &#123;D&#125; = \\&#123;(s_i, a_i)\\&#125;_&#123;i=1&#125;^N collected from an expert policy ^*, BC trains a policy _ by minimizing:  [equation]  where  is a loss function -- mean squared error for continuous actions,.' },
    { title: '2. The Distribution Shift Problem', desc: 'The fatal flaw of behavioral cloning is distribution shift through compounding errors. The expert demonstrations are collected under the expert\'s state distribution d^&#123;^*&#125;, but at test time, the learned policy _ induces its own distribution d^&#123;_&#125;.' },
    { title: '3. DAgger: Dataset Aggregation', desc: 'DAgger (Ross, Gordon, and Bagnell, 2011) addresses distribution shift through an iterative process that queries the expert on the learner\'s own state distribution:  Train initial policy _1 on expert dataset &#123;D&#125;_0 For iteration n = 1, 2, , N:    - Execute current policy _n to collect states \\&#123;s_1,.' },
    { title: '4. Variants Reducing Expert Burden', desc: 'Several methods reduce DAgger\'s reliance on continuous expert access:  SMILe (Ross and Bagnell, 2010): forward training that learns a sequence of non-stationary policies AggreVaTe: queries the expert for action values rather than actions, reducing the cost per query HG-DAgger: uses human gaze or.' },
    { title: '5. GAIL as Imitation Learning', desc: 'Generative Adversarial Imitation Learning (Ho and Ermon, 2016) frames imitation as distribution matching. Rather than matching individual state-action pairs, GAIL matches the occupancy measure -- the distribution over state-action pairs visited by the policy:  [equation]  GAIL minimizes the.' },
    { title: '6. When Imitation Beats RL', desc: 'Imitation learning outperforms RL when: The reward function is unknown or difficult to specify Expert demonstrations are available and cheaper than reward engineering The task horizon is moderate (BC works) or expert access is available (DAgger works) Sample efficiency is critical -- BC requires.' },
];

export default function WalkthroughRLImitationLearning() {
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
          Imitation Learning \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how imitation learning works, one stage at a time.
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
