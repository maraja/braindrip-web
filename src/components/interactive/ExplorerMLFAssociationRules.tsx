import { useState } from 'react';

const DETAILS = [
    { label: 'Apriori complexity', detail: 'In the worst case, exponential in the number of items ($2^m$ possible subsets). In practice, the minimum support threshold keeps the number of frequent itemsets manageable.' },
    { label: 'FP-Growth complexity', detail: '$O(n \\cdot m)$ for tree construction, where $n$ is the number of transactions and $m$ is the average transaction length. Mining complexity depends on tree structure.' },
    { label: 'Minimum support trade-off', detail: 'Too high and you miss interesting rare patterns. Too low and you drown in spurious associations and combinatorial explosion.' },
    { label: 'Additional metrics', detail: 'Beyond support, confidence, and lift, practitioners use conviction ($\\frac{1 - \\text{support}(B)}{1 - \\text{confidence}(A \\Rightarrow B)}$), leverage ($P(A \\cap B) - P(A) \\cdot P(B)$), and cosine similarity to filter rules.' },
    { label: 'Handling continuous data', detail: 'Association rules require discrete items. Continuous features must be binned (e.g., age groups, price ranges) before mining.' },
    { label: 'Redundancy elimination', detail: 'Closed and maximal frequent itemsets reduce the output by removing subsets that carry no additional information beyond their supersets.' },
];

export default function ExplorerMLFAssociationRules() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Association Rules — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of association rules.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {DETAILS.map((d, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)} style={{
            textAlign: 'left' as const, background: open === i ? '#F0EBE1' : '#FDFBF7', border: '1px solid #E5DFD3',
            borderRadius: '10px', padding: '0.875rem 1rem', cursor: 'pointer', width: '100%', transition: 'background 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.95rem', fontWeight: 600, color: '#2C3E2D' }}>
                {d.label}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#7A8B7C', transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
                &#9654;
              </span>
            </div>
            {open === i && (
              <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: '0.5rem 0 0 0' }}>
                {d.detail}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
