import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyExpertParallelism() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏥', label: 'Hospital Departments', text: 'A hospital distributes its specialists across different buildings: cardiology in Building A, neurology in Building B. Patients are routed to the right building. Expert parallelism places different MoE experts on different GPUs. When a token routes to Expert 3, it is sent to the GPU hosting that expert. This distributes the massive total parameter count of MoE models while keeping per-GPU memory manageable.' },
    { emoji: '📞', label: 'Call Center Pods', text: 'A large call center has specialized pods in different offices: billing agents in Office 1, tech support in Office 2. Calls are routed to the right pod. Expert parallelism routes tokens to the GPU hosting their selected expert. The challenge is load balancing: if too many tokens route to one expert (office), that GPU becomes a bottleneck while others sit idle.' },
    { emoji: '🌐', label: 'CDN Servers', text: 'A content delivery network places different content on servers worldwide. Requests are routed to the server with the relevant content. Expert parallelism distributes experts across GPUs the same way: each GPU hosts a subset of experts, and all-to-all communication routes tokens to the right GPU. This is the key innovation that makes MoE models with hundreds of experts practical to train and serve.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
