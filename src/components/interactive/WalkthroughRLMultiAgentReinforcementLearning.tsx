import { useState } from 'react';

const STEPS = [
    { title: '1. Problem Formulation: Stochastic Games', desc: 'MARL extends the MDP to a stochastic game (also called a Markov game), defined by the tuple (N, S, \\&#123;A_i\\&#125;_&#123;i=1&#125;^N, T, \\&#123;R_i\\&#125;_&#123;i=1&#125;^N, ) where N is the number of agents, S is the shared state space, A_i is the action space of agent i, and the transition function depends on the joint.' },
    { title: '2. Independent Learners', desc: 'The simplest approach is to have each agent run its own single-agent RL algorithm while treating other agents as part of the environment. Agent i learns Q_i(s, a_i) ignoring the actions of others.' },
    { title: '3. Centralized Training with Decentralized Execution (CTDE)', desc: 'The dominant paradigm in modern MARL is CTDE: during training, a central critic has access to all agents\' observations and actions, but during execution, each agent acts using only its local observations.' },
    { title: '4. QMIX: Monotonic Value Decomposition', desc: 'QMIX (Rashid et al., 2018) is a cooperative MARL algorithm that factors the joint action-value function into individual utilities while enforcing a monotonicity constraint:  [equation]  where f_s is a mixing network with non-negative weights (ensuring &#123; Q_&#123;tot&#125;&#125;&#123; Q_i&#125;  0).' },
    { title: '5. MAPPO: Multi-Agent PPO', desc: 'Multi-Agent PPO (Yu et al., 2022) applies proximal policy optimization in the CTDE framework. Each agent has its own policy network _&#123;_i&#125;(a_i  o_i) and shares a centralized value function V_(s).' },
    { title: '6. Nash Equilibrium and Solution Concepts', desc: 'In competitive settings, the goal shifts from joint reward maximization to finding a Nash equilibrium -- a joint policy where no agent can improve its return by unilaterally changing its strategy:  [equation]  Computing Nash equilibria is PPAD-complete in general, making it intractable for large.' },
];

export default function WalkthroughRLMultiAgentReinforcementLearning() {
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
          Multi-Agent Reinforcement Learning \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how multi-agent reinforcement learning works, one stage at a time.
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
