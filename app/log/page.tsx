'use client'
import { useState } from 'react'
import { useAppState } from '@/lib/useAppState'
import { TRACK_META } from '@/lib/data'
import { TrackId } from '@/types'

const TRACK_IDS: TrackId[] = ['devops', 'ai', 'music', 'datascience', 'web', 'reading']

export default function LogPage() {
  const { state, hydrated, addLog } = useAppState()
  const [track, setTrack] = useState<TrackId>('ai')
  const [minutes, setMinutes] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [saved, setSaved] = useState(false)

  function handleSubmit() {
    if (!minutes || parseInt(minutes) < 1) return
    addLog({ trackId: track, minutes: parseInt(minutes), note, date })
    setMinutes('')
    setNote('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!hydrated) return null

  const inputStyle = {
    background: 'var(--bg3)', border: '1px solid var(--border2)',
    borderRadius: 8, padding: '9px 12px', color: 'var(--text1)',
    fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none',
    width: '100%',
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 640 }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Log a session
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
          Record what you worked on today
        </p>
      </div>

      <div className="fade-up-1" style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px', marginBottom: 24 }}>
        {/* Track selector */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>
            Track
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {TRACK_IDS.map(id => (
              <button key={id} onClick={() => setTrack(id)} style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                background: track === id ? `${TRACK_META[id].color}22` : 'var(--bg4)',
                border: `1px solid ${track === id ? TRACK_META[id].color : 'var(--border)'}`,
                color: track === id ? TRACK_META[id].color : 'var(--text2)',
                transition: 'all 0.15s',
              }}>
                {TRACK_META[id].label}
              </button>
            ))}
          </div>
        </div>

        {/* Minutes + Date row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
              Minutes
            </label>
            <input type="number" min="5" max="480" placeholder="e.g. 45" value={minutes}
              onChange={e => setMinutes(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
              Date
            </label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
          </div>
        </div>

        {/* Note */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
            What did you work on?
          </label>
          <input type="text" placeholder="e.g. Built a RAG pipeline, practiced barre chords..."
            value={note} onChange={e => setNote(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={inputStyle} />
        </div>

        <button onClick={handleSubmit} style={{
          width: '100%', padding: '10px', borderRadius: 8, cursor: 'pointer',
          background: saved ? '#22c55e20' : TRACK_META[track].color,
          border: `1px solid ${saved ? '#22c55e' : TRACK_META[track].color}`,
          color: saved ? '#22c55e' : '#fff', fontSize: 13, fontWeight: 500,
          fontFamily: 'var(--font-body)', transition: 'all 0.2s',
        }}>
          {saved ? '✓ Session saved' : 'Save session'}
        </button>
      </div>

      {/* History */}
      <div className="fade-up-2">
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: 12 }}>
          Session history ({state.logEntries.length})
        </div>
        {state.logEntries.length === 0 ? (
          <div style={{ color: 'var(--text3)', fontSize: 13, padding: '20px 0' }}>No sessions yet.</div>
        ) : (
          state.logEntries.map((e, i) => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < state.logEntries.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 3, height: 36, borderRadius: 2, background: TRACK_META[e.trackId as TrackId]?.color || '#888', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--text1)', marginBottom: 1 }}>{e.note || '—'}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{TRACK_META[e.trackId as TrackId]?.label} · {e.date}</div>
              </div>
              <span style={{ fontSize: 13, color: 'var(--text2)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{e.minutes}m</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
