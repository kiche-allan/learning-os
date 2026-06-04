interface Props {
  pct: number
  color: string
  height?: number
  showLabel?: boolean
  label?: string
}

export default function ProgressBar({ pct, color, height = 4, showLabel, label }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {label && (
        <span style={{ fontSize: 12, color: 'var(--text3)', width: 110, textAlign: 'right', flexShrink: 0 }}>
          {label}
        </span>
      )}
      <div style={{
        flex: 1, height, background: 'var(--bg4)', borderRadius: height / 2, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: color, borderRadius: height / 2,
          transition: 'width 0.5s ease',
        }} />
      </div>
      {showLabel && (
        <span style={{ fontSize: 12, color: 'var(--text3)', width: 32, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
          {pct}%
        </span>
      )}
    </div>
  )
}
