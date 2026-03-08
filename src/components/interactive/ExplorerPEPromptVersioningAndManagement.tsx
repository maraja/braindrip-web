import { useState } from 'react';

const DETAILS = [
    { label: 'Version identifier format', detail: 'Use semantic versioning (e.g., v2.3.1) or date-based versioning (e.g., 2024-01-15-a) to clearly identify prompt versions. Include a hash for exact match verification.' },
    { label: 'Regression test suite size', detail: '20-50 test cases per prompt is a practical starting point; critical applications may require 100-200+. Tests should cover both positive cases (correct behavior) and negative cases (constraint adherence).' },
    { label: 'Test execution cost', detail: 'Running a 50-test regression suite against a prompt costs 50 API calls. At 0.01-0.10 per call (depending on model and prompt length), a full regression run costs 0.50-5.00, cheap enough to run on every prompt change.' },
    { label: 'A/B test duration', detail: 'Typical prompt A/B tests require 1-4 weeks to reach statistical significance, depending on traffic volume. Minimum 500 conversations per variant for most metrics.' },
    { label: 'Rollback time', detail: 'With a prompt registry, rollback is effectively instant (change the active version pointer). Without one, rollback requires a code deployment, taking minutes to hours.' },
    { label: 'Prompt registry features', detail: 'A production prompt registry should support: versioning, access control, deployment status tracking, A/B test assignment, metric tagging, and integration with CI/CD pipelines.' },
];

export default function ExplorerPEPromptVersioningAndManagement() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Prompt Versioning and Management \u2014 Key Details Explorer
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
