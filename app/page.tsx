'use client'
import { useAppState } from '@/lib/useAppState'
import { TRACK_META, TOPICS, BOOKS } from '@/lib/data'
import StatCard from '@/components/StatCard'
import ProgressBar from '@/components/ProgressBar'
import Link from 'next/link'
import { TrackId } from '@/types'

const TRACK_IDS: TrackId[] = ['devops', 'ai', 'music', 'datascience', 'web']
const WEEKS = 26

export default function Dashboard() {
  const { state, hydrated, getTrackProgress, getWeeklyMinutes } = useAppState()

  if (!hydrated) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
      loading...
    </div>
  )

  const allTopics = Object.values(TOPICS).flat()
  const totalDone = allTopics.filter(t => state.completedTopics.includes(t.id)).length
  const overallPct = Math.round((totalDone / allTopics.length) * 100)
  const weekMins = getWeeklyMinutes()
  const weekHrs = weekMins >= 60 ? `${(weekMins / 60).toFixed(1)}h` : `${weekMins}m`
  const booksDone = BOOKS.filter(b => (state.bookStatuses[b.id] ?? b.status) === 'done').length
  const currentBook = BOOKS.find(b => (state.bookStatuses[b.id] ?? b.status) === 'reading')

  const startDate = new Date('2025-06-04')
  const today = new Date()
  const logDates = new Set(state.logEntries.map(e => e.date))

  const weeks = Array.from({ length: WEEKS }, (_, i) => {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i * 7)
    const ds = d.toISOString().split('T')[0]
    const isCurrent = d <= today && new Date(d.getTime() + 7 * 86400000) > today
    const isPast = d < today
    const hasLog = logDates.has(ds)
    return { ds, isPast, isCurrent, hasLog, weekNum: i + 1 }
  })

  const monthLabels = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <div style={{ padding: '32px 36px', maxWidth: 900 }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text1)', marginBottom: 4 }}>
          Command Center
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
          June 4 → December 4, 2025 · 26 weeks · 6 tracks
        </p>
      </div>

      <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 28 }}>
        <StatCard label="Overall progress" value={`${overallPct}%`} sub={`${totalDone} of ${allTopics.length} topics`} accent="#22c55e" />
        <StatCard label="This week" value={weekHrs} sub="logged" accent="#3b82f6" />
        <StatCard label="Day streak" value={`${state.streak}d`} sub="consecutive days" accent="#f59e0b" />
        <StatCard label="Books done" value={booksDone} sub={`of ${BOOKS.length} queued`} accent="#a855f7" />
      </div>

      <div className="fade-up-2" style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: 12 }}>
          26-week progress map
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(26, 1fr)', gap: 4, marginBottom: 8 }}>
          {weeks.map(w => (
            <div key={w.ds} title={`Week ${w.weekNum}: ${w.ds}`} style={{
              aspectRatio: '1', borderRadius: 3,
              background: w.hasLog ? '#22c55e' : w.isCurrent ? '#22c55e40' : 'var(--bg4)',
              border: w.isCurrent ? '1px solid #22c55e60' : '1px solid transparent',
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
          {monthLabels.map(m => <span key={m}>{m}</span>)}
        </div>
      </div>

      <div className="fade-up-3" style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: 14 }}>
          Track progress
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TRACK_IDS.map(id => {
            const pct = getTrackProgress(id, TOPICS[id])
            return (
              <Link key={id} href={`/tracks/${id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '5px 0' }}>
                <span style={{ fontSize: 12, color: 'var(--text3)', width: 130, flexShrink: 0 }}>{TRACK_META[id].label}</span>
                <div style={{ flex: 1 }}><ProgressBar pct={pct} color={TRACK_META[id].color} height={4} /></div>
                <span style={{ fontSize: 12, color: 'var(--text3)', width: 32, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{pct}%</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="fade-up-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: 14 }}>
            Active sprint — LLM Zoomcamp
          </div>
          {[
            { wk: 'Wk 1', title: 'Intro to LLMs & RAG', id: 'ai1' },
            { wk: 'Wk 2', title: 'Open-source LLMs', id: 'ai2' },
            { wk: 'Wk 3', title: 'Vector databases', id: 'ai3' },
            { wk: 'Wk 4', title: 'Evaluation', id: 'ai4' },
            { wk: 'Wk 5', title: 'Capstone project', id: 'ai5' },
          ].map((item, i) => {
            const done = state.completedTopics.includes(item.id)
            return (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: done ? '#7c3aed' : 'var(--bg4)', border: `1px solid ${done ? '#7c3aed' : 'var(--border2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {done && <span style={{ fontSize: 9, color: '#fff', fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ fontSize: 12, color: done ? 'var(--text3)' : 'var(--text1)', flex: 1 }}>{item.title}</span>
                <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{item.wk}</span>
              </div>
            )
          })}
        </div>

        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: 14 }}>
            Reading now
          </div>
          {currentBook ? (
            <>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 10, borderRadius: 3, background: currentBook.color, flexShrink: 0, minHeight: 64 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', marginBottom: 2 }}>{currentBook.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>{currentBook.author}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{currentBook.why.slice(0, 100)}...</div>
                </div>
              </div>
              <ProgressBar pct={state.bookProgress[currentBook.id] ?? 0} color={currentBook.color} height={3} showLabel />
            </>
          ) : (
            <Link href="/tracks/reading" style={{ fontSize: 13, color: 'var(--text3)', textDecoration: 'none' }}>No active book → start reading ↗</Link>
          )}
        </div>
      </div>

      {state.logEntries.length > 0 && (
        <div className="fade-up-5" style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)' }}>Recent sessions</div>
            <Link href="/log" style={{ fontSize: 11, color: 'var(--text3)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {state.logEntries.slice(0, 4).map(e => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: `${TRACK_META[e.trackId as TrackId]?.color || '#888'}18`, color: TRACK_META[e.trackId as TrackId]?.color || '#888', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                {TRACK_META[e.trackId as TrackId]?.label || e.trackId}
              </span>
              <span style={{ flex: 1, fontSize: 13, color: 'var(--text2)' }}>{e.note || '—'}</span>
              <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{e.minutes}m · {e.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
