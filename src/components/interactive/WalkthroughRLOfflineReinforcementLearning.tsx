import { useState } from 'react';

const STEPS = [
    { title: '1. The Offline RL Problem', desc: 'The agent is given a static dataset &#123;D&#125; = \\&#123;(s_i, a_i, r_i, s_i\')\\&#125;_&#123;i=1&#125;^N collected by some unknown behavior policy _. The goal is to learn a policy  that maximizes:  [equation]  using only &#123;D&#125;, with no environment interaction.' },
    { title: '2. Why Offline RL Is Hard: Extrapolation Error', desc: 'The fundamental challenge is extrapolation error (also called distributional shift in the action dimension). Standard Q-learning updates use:  [equation]  The  operator selects the action with the highest Q-value in the next state.' },
    { title: '3. Conservative Q-Learning (CQL)', desc: 'CQL (Kumar et al., 2020) addresses extrapolation error by adding a regularizer that explicitly pushes down Q-values for out-of-distribution actions:  [equation]  The first term penalizes high Q-values under a sampling distribution  (typically uniform or the current policy) while boosting Q-values.' },
    { title: '4. Batch-Constrained Q-Learning (BCQ)', desc: 'BCQ (Fujimoto et al., 2019) takes a different approach: explicitly constraining the policy to only select actions similar to those in the dataset. It trains a generative model G_(s) of the behavior policy and restricts action selection:  [equation]  where _ is a small perturbation network.' },
    { title: '5. Implicit Q-Learning (IQL)', desc: 'IQL (Kostrikov et al., 2022) avoids querying out-of-distribution actions entirely by reformulating the Bellman backup. Instead of using _&#123;a\'&#125; Q(s\', a\'), IQL learns the value function using expectile regression:  [equation]  where   (0, 1) controls the expectile.' },
    { title: '6. Decision Transformers', desc: 'Decision Transformer (Chen et al., 2021) reframes offline RL as sequence modeling. It trains a transformer to predict actions conditioned on the desired return:  [equation]  where R_t = _&#123;t\'=t&#125;^T r_&#123;t\'&#125; is the return-to-go.' },
];

export default function WalkthroughRLOfflineReinforcementLearning() {
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
          Offline Reinforcement Learning \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how offline reinforcement learning works, one stage at a time.
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
