import { useState } from 'react';

const DETAILS = [
    { label: 'Docker security profiles', detail: 'AppArmor or Seccomp profiles restrict which system calls the container can make. A well-configured profile blocks dangerous syscalls (mount, reboot, module loading) while allowing normal operation. Docker\'s default seccomp profile blocks about 44 of the 300+ Linux syscalls.' },
    { label: 'Firecracker vs Docker', detail: 'Docker provides OS-level isolation (shared kernel). Firecracker provides hardware-level isolation (separate lightweight VM). Firecracker is more secure but adds ~125ms boot time and slightly more memory overhead.' },
    { label: 'Ephemeral environments', detail: 'Sandboxes are created fresh for each agent session and destroyed afterward. No state persists between sessions unless explicitly exported through a controlled output channel. This prevents agents from establishing persistent footholds.' },
    { label: 'Output sanitization', detail: 'When the agent produces results that leave the sandbox (files, API responses, messages), the output channel sanitizes them to prevent sandbox escape through output manipulation. This includes scanning for executable content, scripts, or encoded payloads.' },
    { label: 'Monitoring within the sandbox', detail: 'System call tracing (strace/dtrace) and file system monitoring (inotify) inside the sandbox log every action the agent takes. These logs are stored outside the sandbox for post-hoc analysis and anomaly detection.' },
    { label: 'Warm sandbox pools', detail: 'Spinning up a fresh container for every request adds latency. Production systems maintain pools of pre-warmed, clean sandbox instances that can be assigned to agents instantly and recycled after use.' },
];

export default function ExplorerAACAgentSandboxing() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Agent Sandboxing \u2014 Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details.
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
