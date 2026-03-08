import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCOrbAndBinaryDescriptors() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine describing a face to a sketch artist using only yes/no questions: "Is the left eye darker than the right? Is the nose wider than the mouth?" Each answer is one bit, and the full set of answers forms a binary code.' },
    { emoji: '⚙️', label: 'How It Works', text: '(2010) proposed BRIEF as the first practical binary descriptor:  Smooth the patch with a Gaussian (  2) to reduce noise sensitivity. Select n pairs of pixel locations (p_i, q_i) within the patch (typically n = 256). For each pair, compute: b_i = &#123;cases&#125; 1 & if  I(p_i) &lt; I(q_i) \\\\ 0 & otherwise &#123;cases&#125; Concatenate to form an n-bit string.' },
    { emoji: '🔍', label: 'In Detail', text: 'ORB (Oriented FAST and Rotated BRIEF), introduced by Rublee et al. (2011), combines the FAST keypoint detector with a rotation-aware version of the BRIEF descriptor, providing a patent-free, real-time alternative to SIFT and SURF.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u2726 KEY PERSPECTIVES</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' as const }}>
        {perspectives.map((p, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA88818' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {p.emoji} {p.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{perspectives[idx].text}</p>
    </div>
  );
}
