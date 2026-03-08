import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyADPAgentTestingStrategy() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think about testing a self-driving car. You do not just put it on the road and see what happens. You start with unit tests for individual sensors -- does the LIDAR return correct distance readings? Then integration tests for subsystems -- does the perception system correctly identify a pedestrian from the sensor fusion pipeline?' },
    { emoji: '⚙️', label: 'How It Works', text: 'Unit tests validate individual components in isolation. For agent systems, the key unit-testable components are tools, prompt templates, output parsers, and routing logic. Tool unit tests verify that each tool behaves correctly given known inputs:  Test that valid inputs produce expected outputs (happy path).' },
    { emoji: '🔍', label: 'In Detail', text: 'Agent testing follows the same pyramid structure, but with a twist that traditional software does not have: non-determinism. The same agent, given the same input, may take a different path and produce a different output on every run. This means you cannot simply assert that output equals expected value.' },
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
