import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE07OpenVsClosedTheNarrowingGap() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two car manufacturers: one sells completed vehicles with locked hoods, the other publishes complete blueprints and lets anyone build the car. For years, the locked-hood cars were dramatically better — faster, safer, more reliable. Then the blueprints started catching up.' },
    { emoji: '⚙️', label: 'How It Works', text: 'When Meta released LLaMA 1 (February 2023) with 65B parameters, it scored approximately 63.4% on MMLU. GPT-4, released the following month, scored approximately 86.4%. The 23-point gap represented roughly a generation of capability difference.' },
    { emoji: '🔍', label: 'In Detail', text: '"Open" here means models whose weights are publicly released — anyone can download, run, modify, and build on them. LLaMA, Mistral, DeepSeek, and Qwen are the major open families. "Closed" means models accessible only through APIs, with weights proprietary: GPT-4/5, Claude, and Gemini.' },
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
