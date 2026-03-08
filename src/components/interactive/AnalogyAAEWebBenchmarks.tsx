import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEWebBenchmarks() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine asking someone to book a flight, post on a forum, manage a CMS, and file a bug report -- all through web interfaces they have never seen before. Web benchmarks test whether AI agents can perform exactly these kinds of tasks, navigating real (or realistic) websites using the same browser interface a human would use.' },
    { emoji: '⚙️', label: 'How It Works', text: 'WebArena (Zhou et al., 2024) is the most widely cited web agent benchmark. It comprises 812 tasks across four self-hosted web applications:  E-commerce (OpenStreetMap-based shopping site): product search, price comparison, cart management Forums (Reddit-style platform): posting, commenting, navigating threads CMS (GitLab instance): repository.' },
    { emoji: '🔍', label: 'In Detail', text: 'Unlike static question-answering benchmarks, web benchmarks require agents to interact with dynamic, stateful environments. A single task might involve clicking through menus, filling forms, interpreting page content, and verifying outcomes across multiple page loads.' },
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
