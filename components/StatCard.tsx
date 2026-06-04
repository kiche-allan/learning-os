interface Props {
  label: string
  value: string | number
  sub?: string
  accent?: string
}

export default function StatCard({ label, value, sub, accent }: Props) {
  return (
    <div style={{
      background: 'var(--bg3)', borderRadius: 10,
      border: '1px solid var(--border)', padding: '14px 16px',
    }}>
      <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, color: accent || 'var(--text1)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{sub}</div>
      )}
    </div>
  )
}
