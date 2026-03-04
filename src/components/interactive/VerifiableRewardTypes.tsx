import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const CATEGORIES = [
  {
    name: 'Math',
    icon: 'Σ',
    color: '#C76B4A',
    method: 'Exact Match Verification',
    description: 'Compare the model\'s final numerical answer against the ground truth. Parsing extracts the boxed or final answer from the reasoning chain.',
    problem: 'Find all integers n such that n² + 3n + 2 is divisible by 6.',
    solution: 'n² + 3n + 2 = (n+1)(n+2)\nThree consecutive integers: n, n+1, n+2\nProduct of any 2 consecutive ints is even → (n+1)(n+2) divisible by 2\nAmong any 3 consecutive, one divisible by 3\n∴ (n+1)(n+2) divisible by 6 for all n ∈ Z',
    answer: 'All integers n',
    groundTruth: 'All integers',
    reward: 1.0,
    rewardLabel: 'Exact match ✓',
  },
  {
    name: 'Code',
    icon: '{ }',
    color: '#8BA888',
    method: 'Test Case Execution',
    description: 'Execute the model\'s generated code against a suite of hidden test cases. The reward is the fraction of tests passed, enabling partial credit.',
    problem: 'Write a function that returns the longest palindromic substring.',
    solution: 'def longest_palindrome(s: str) -> str:\n    best = ""\n    for i in range(len(s)):\n        for l, r in [(i,i), (i,i+1)]:\n            while l>=0 and r<len(s) and s[l]==s[r]:\n                l -= 1; r += 1\n            if r-l-1 > len(best):\n                best = s[l+1:r]\n    return best',
    answer: 'Function implementation',
    groundTruth: '14/15 tests pass',
    reward: 0.93,
    rewardLabel: '14/15 tests passed',
  },
  {
    name: 'Logic',
    icon: '∀',
    color: '#D4A843',
    method: 'Formal Proof Verification',
    description: 'Use a proof assistant (Lean, Isabelle) or logical checker to verify the model\'s reasoning steps are valid. Each step must follow from axioms or prior steps.',
    problem: 'Prove: If A ⊆ B and B ⊆ C, then A ⊆ C.',
    solution: 'Proof:\n  Let x ∈ A.            (assume arbitrary element)\n  Since A ⊆ B, x ∈ B.  (by definition of subset)\n  Since B ⊆ C, x ∈ C.  (by definition of subset)\n  ∴ x ∈ A → x ∈ C.     (for all x)\n  ∴ A ⊆ C.              QED',
    answer: 'Valid proof',
    groundTruth: 'All steps verified',
    reward: 1.0,
    rewardLabel: 'Proof valid ✓',
  },
  {
    name: 'Format',
    icon: '⟨⟩',
    color: '#7A8B7C',
    method: 'Structural Compliance',
    description: 'Verify the output matches a required schema or format — valid JSON, XML, specific field names, length constraints, or regex patterns. Binary reward.',
    problem: 'Return a JSON object with fields: name (string), age (number), skills (array of strings).',
    solution: '{\n  "name": "Alice Chen",\n  "age": 29,\n  "skills": [\n    "Python",\n    "Machine Learning",\n    "Data Visualization"\n  ]\n}',
    answer: 'Valid JSON with all fields',
    groundTruth: 'Schema validates ✓',
    reward: 1.0,
    rewardLabel: 'Schema compliant ✓',
  },
];

export default function VerifiableRewardTypes() {
  const [catIdx, setCatIdx] = useState(0);
  const [showVerification, setShowVerification] = useState(false);
  const cat = CATEGORIES[catIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Verifiable Reward Types (RLVR)
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Explore how different domains enable automated, verifiable reward signals for RL training.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map((c, i) => (
          <button key={c.name} onClick={() => { setCatIdx(i); setShowVerification(false); }} style={{
            padding: '0.4rem 0.75rem', borderRadius: '6px',
            border: `1px solid ${catIdx === i ? c.color : '#E5DFD3'}`,
            background: catIdx === i ? `${c.color}12` : 'transparent',
            color: catIdx === i ? c.color : '#5A6B5C',
            fontWeight: catIdx === i ? 600 : 400,
            fontSize: '0.78rem', cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.65rem', color: '#7A8B7C', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600 }}>Verification Method</span>
          <span style={{ fontSize: '0.72rem', color: cat.color, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{cat.method}</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#5A6B5C', lineHeight: 1.55 }}>{cat.description}</div>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.3rem' }}>Example Problem</div>
        <div style={{ fontSize: '0.85rem', color: '#2C3E2D', fontWeight: 500 }}>{cat.problem}</div>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.3rem' }}>Model Output</div>
        <pre style={{ fontSize: '0.72rem', color: '#2C3E2D', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.5 }}>{cat.solution}</pre>
      </div>

      <button onClick={() => setShowVerification(!showVerification)} style={{
        width: '100%', padding: '0.55rem', borderRadius: '6px', marginBottom: '0.75rem',
        border: `1px solid ${cat.color}`, cursor: 'pointer', fontWeight: 600,
        background: showVerification ? `${cat.color}10` : 'transparent',
        color: cat.color, fontSize: '0.78rem',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        {showVerification ? '▾ Hide' : '▸ Run'} Verification
      </button>

      {showVerification && (
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: '#7A8B7C', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.3rem' }}>Ground Truth</div>
              <div style={{ fontSize: '0.78rem', color: '#2C3E2D', fontWeight: 500 }}>{cat.groundTruth}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: '#7A8B7C', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.3rem' }}>Reward Signal</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: cat.color, fontFamily: "'JetBrains Mono', monospace" }}>{cat.reward.toFixed(2)}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: '#7A8B7C', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.3rem' }}>Result</div>
              <div style={{ fontSize: '0.78rem', color: cat.reward >= 0.9 ? '#8BA888' : '#D4A843', fontWeight: 600 }}>{cat.rewardLabel}</div>
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', height: '6px', background: '#E5DFD3', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${cat.reward * 100}%`, height: '100%', background: cat.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      )}

      <div style={{ background: 'rgba(139, 168, 136, 0.06)', border: '1px solid #8BA888', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#8BA888', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 700, marginBottom: '0.2rem' }}>Why Verifiable?</div>
        <div style={{ fontSize: '0.72rem', color: '#5A6B5C', lineHeight: 1.55 }}>
          Unlike human preference (subjective, expensive), verifiable rewards are automated, consistent, and scalable. This enables training on millions of RL episodes without human annotators.
        </div>
      </div>
    </div>
  );
}
