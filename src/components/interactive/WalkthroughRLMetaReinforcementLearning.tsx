import { useState } from 'react';

const STEPS = [
    { title: '1. Problem Formulation', desc: 'Meta-RL assumes a distribution over tasks p(&#123;T&#125;), where each task &#123;T&#125;_i is an MDP with its own reward function R_i and possibly its own transition dynamics T_i. The meta-objective is:  [equation]  where  are the meta-parameters and _i\' are the task-specific adapted parameters.' },
    { title: '2. MAML for RL: Gradient-Based Meta-Learning', desc: 'Model-Agnostic Meta-Learning (MAML; Finn, Chelsea, Abbeel, and Levine, 2017) meta-learns an initialization  of the policy network such that a few gradient steps on a new task produce a good policy.' },
    { title: '3. RL-Squared: Context-Based Meta-RL', desc: 'RL^2 (Duan et al., 2016) takes a fundamentally different approach: it encodes the adaptation mechanism directly into the agent\'s recurrent architecture.' },
    { title: '4. Context-Based Meta-RL and Task Inference', desc: 'More recent context-based methods explicitly separate task inference from policy execution. PEARL (Rakelly et al., 2019) maintains a probabilistic context encoder:  [equation]  The context variable z is inferred from a small set of transitions and conditions the policy _(a  s, z) and value function.' },
    { title: '5. Task Distributions', desc: 'The design of the task distribution p(&#123;T&#125;) is critical and often underappreciated:  Reward variation: same dynamics, different reward functions (e.g., navigate to different goals) Dynamics variation: same reward, different physics (e.g.' },
    { title: '6. In-Context RL', desc: 'Recent work frames meta-RL as in-context learning using transformers. Algorithm Distillation (Laskin et al., 2022) trains a transformer on sequences of learning histories -- entire training runs of RL agents on different tasks.' },
];

export default function WalkthroughRLMetaReinforcementLearning() {
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
          Meta-Reinforcement Learning \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how meta-reinforcement learning works, one stage at a time.
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
