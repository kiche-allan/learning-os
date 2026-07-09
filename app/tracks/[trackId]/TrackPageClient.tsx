'use client'
import { useAppState } from '@/lib/useAppState'
import { TRACK_META, TOPICS, BOOKS } from '@/lib/data'
import { TrackId } from '@/types'
import TopicRow from '@/components/TopicRow'
import ProgressBar from '@/components/ProgressBar'
import StatCard from '@/components/StatCard'

const PHASE_LABELS: Record<TrackId, Record<number, string>> = {
  devops:      { 1: 'Foundation', 2: 'Containers & CI/CD', 3: 'Cloud & SRE' },
  ai:          { 0: '✓ LLM Zoomcamp — applied RAG (done)', 1: 'Math & Python foundations', 2: 'Classical machine learning', 3: 'Neural networks from scratch', 4: 'Sequence models & Transformers', 5: 'Applied modern AI (LLMs, agents, fine-tuning)' },
  music:       { 1: 'Foundation — semi-acoustic (months 1–3)', 2: 'Intermediate — semi-acoustic (months 4–7)', 3: 'Advanced semi-acoustic (months 8–12)', 4: 'Electric guitar (year 2+)' },
  datascience: { 1: 'Math & Python foundations', 2: 'Classical machine learning', 3: 'Deep learning', 4: 'MLOps & capstone' },
  web:         { 1: 'Next.js App Router', 2: 'Node.js backend', 3: 'Nuxt 3 & edge' },
  reading:     {},
}

export default function TrackPageClient({ trackId }: { trackId: string }) {
  const id = trackId as TrackId
  const { state, hydrated, toggleTopic, setBookProgress, getTrackProgress } = useAppState()

  if (!hydrated) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
      loading...
    </div>
  )

  const meta = TRACK_META[id]
  if (!meta) return <div style={{ padding: 32, color: 'var(--text3)' }}>Track not found.</div>

  // Reading track
  if (id === 'reading') {
    return (
      <div style={{ padding: '32px 36px', maxWidth: 720 }}>
        <div className="fade-up" style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 20, color: meta.color }}>{meta.icon}</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
              {meta.label}
            </h1>
          </div>
          <p style={{ color: 'var(--text3)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>{meta.description}</p>
        </div>

        <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, margin: '20px 0' }}>
          <StatCard label="Books done" value={BOOKS.filter(b => (state.bookStatuses[b.id] ?? b.status) === 'done').length} sub={`of ${BOOKS.length}`} accent="#22c55e" />
          <StatCard label="Reading" value={BOOKS.find(b => (state.bookStatuses[b.id] ?? b.status) === 'reading')?.title.split(' ').slice(0,2).join(' ') || '—'} sub="current book" />
          <StatCard label="Pages/day goal" value="20" sub="~1 book/month" accent={meta.color} />
        </div>

        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: 14 }}>
          Your shelf
        </div>

        {BOOKS.map((book, i) => {
          const status = state.bookStatuses[book.id] ?? book.status
          const progress = state.bookProgress[book.id] ?? (status === 'done' ? 100 : 0)

          return (
            <div key={book.id} className={`fade-up-${Math.min(i + 1, 6)}`} style={{
              background: 'var(--bg3)', border: `1px solid ${status === 'reading' ? `${book.color}40` : 'var(--border)'}`,
              borderRadius: 12, padding: '16px 18px', marginBottom: 10, display: 'flex', gap: 14,
            }}>
              <div style={{ width: 10, borderRadius: 4, background: book.color, flexShrink: 0, minHeight: 70, opacity: status === 'queued' ? 0.4 : 1 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 2 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)' }}>{book.title}</span>
                    <span style={{ fontSize: 12, color: 'var(--text3)', marginLeft: 8 }}>— {book.author} · {book.year}</span>
                  </div>
                  <span style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 10, flexShrink: 0,
                    background: status === 'done' ? '#22c55e18' : status === 'reading' ? `${book.color}18` : 'var(--bg4)',
                    color: status === 'done' ? '#22c55e' : status === 'reading' ? book.color : 'var(--text3)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {status}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 10, marginTop: 4 }}>{book.why}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {book.tags.map(t => (
                    <span key={t} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: 'var(--bg4)', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
                      {t}
                    </span>
                  ))}
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: 'var(--bg4)', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
                    {book.pages}p
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1 }}><ProgressBar pct={progress} color={book.color} height={3} /></div>
                  <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', width: 32, textAlign: 'right' }}>{progress}%</span>
                  <input type="range" min={0} max={100} step={1} value={progress}
                    onChange={e => setBookProgress(book.id, parseInt(e.target.value))}
                    style={{ width: 80 }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // All other tracks
  const topics = TOPICS[id] || []
  const phases = [...new Set(topics.map(t => t.phase))].sort()
  const pct = getTrackProgress(id, topics)
  const doneCount = topics.filter(t => state.completedTopics.includes(t.id)).length

  return (
    <div style={{ padding: '32px 36px', maxWidth: 800 }}>
      <div className="fade-up" style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 20, color: meta.color }}>{meta.icon}</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
            {meta.label}
          </h1>
        </div>
        <p style={{ color: 'var(--text3)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
          {meta.description} · {meta.weeks}
        </p>
      </div>

      <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, margin: '20px 0' }}>
        <StatCard label="Progress" value={`${pct}%`} sub={`${doneCount} of ${topics.length} done`} accent={meta.color} />
        <StatCard label="Topics total" value={topics.length} sub={`${phases.length} phases`} />
        <StatCard label="Track" value={meta.icon} sub={meta.label} accent={meta.color} />
      </div>

      <div className="fade-up-2" style={{ marginBottom: 20 }}>
        <ProgressBar pct={pct} color={meta.color} height={6} showLabel />
      </div>

      {phases.map((phase, pi) => {
        const phaseTopics = topics.filter(t => t.phase === phase)
        const phaseLabel = PHASE_LABELS[id]?.[phase] || `Phase ${phase}`
        return (
          <div key={phase} className={`fade-up-${Math.min(pi + 3, 6)}`} style={{ marginBottom: 24 }}>
            <div style={{
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)',
              borderBottom: '1px solid var(--border)', paddingBottom: 6, marginBottom: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span>{phaseLabel}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                {phaseTopics.filter(t => state.completedTopics.includes(t.id)).length}/{phaseTopics.length}
              </span>
            </div>
            {phaseTopics.map(topic => (
              <TopicRow
                key={topic.id}
                topic={topic}
                done={state.completedTopics.includes(topic.id)}
                color={meta.color}
                onToggle={() => toggleTopic(topic.id)}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
