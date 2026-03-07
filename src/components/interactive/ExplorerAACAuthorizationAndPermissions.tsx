import { useState } from 'react';

const DETAILS = [
    { label: 'OAuth 2.0 for agents', detail: 'OAuth scopes are the most natural permission model for API-connected agents. The agent authenticates with scoped tokens that grant specific capabilities. Token expiration ensures permissions are time-limited.' },
    { label: 'Credential isolation', detail: 'The LLM prompt layer should never see raw credentials. Tool implementations inject credentials at runtime from a secure store. The LLM sees only the tool name and parameters, not the authentication details.' },
    { label: 'Permission manifests', detail: 'Each agent (or agent template) has a permission manifest declaring what resources and operations it requires. This manifest is reviewed during deployment, similar to mobile app permission declarations.' },
    { label: 'Break-glass procedures', detail: 'For emergency situations where an agent needs elevated permissions not in its normal scope, break-glass procedures provide a documented, audited path to temporary elevated access. These should require human authorization and be time-limited.' },
    { label: 'Service accounts', detail: 'Agents should use dedicated service accounts (not personal user accounts) with permissions scoped to agent operations. This separates agent access from human access in audit logs and enables independent permission management.' },
    { label: 'Permission monitoring', detail: 'Track which permissions the agent actually uses versus what it has been granted. Permissions that are granted but never used should be reviewed and potentially revoked (permission right-sizing).' },
];

export default function ExplorerAACAuthorizationAndPermissions() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Authorization and Permissions — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of authorization and permissions.
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
