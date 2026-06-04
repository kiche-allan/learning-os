'use client'
import { Topic } from '@/types'

interface Props {
  topic: Topic
  done: boolean
  color: string
  onToggle: () => void
}

const TAG_COLORS: Record<string, string> = {
  done: '#22c55e', active: '#22c55e', soon: '#f59e0b', next: '#6366f1',
  daily: '#22c55e', milestone: '#f59e0b', electric: '#f59e0b',
  capstone: '#ef4444', advanced: '#a855f7', theory: '#6366f1',
  foundation: '#3b82f6', k8s: '#06b6d4', sre: '#f97316', cloud: '#0ea5e9',
  iac: '#84cc16', containers: '#22d3ee', automation: '#a78bfa',
  reading: '#22c55e', queued: '#6b7280',
}

export default function TopicRow({ topic, done, color, onToggle }: Props) {
  const tagColor = TAG_COLORS[topic.tag || ''] || '#6b7280'

  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%',
        padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
        background: done ? `${color}0d` : 'var(--bg3)',
        border: `1px solid ${done ? `${color}30` : 'var(--border)'}`,
        textAlign: 'left', transition: 'all 0.15s', marginBottom: 6,
      }}
    >
      {/* Checkbox */}
      <div style={{
        width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
        background: done ? color : 'transparent',
        border: `1.5px solid ${done ? color : 'var(--border2)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}>
        {done && <span style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>✓</span>}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 13, fontWeight: 500,
            color: done ? 'var(--text2)' : 'var(--text1)',
            textDecoration: done ? 'line-through' : 'none',
          }}>
            {topic.title}
          </span>
          {topic.tag && (
            <span style={{
              fontSize: 10, padding: '2px 7px', borderRadius: 10,
              background: `${tagColor}18`, color: tagColor,
              fontFamily: 'var(--font-mono)',
            }}>
              {topic.tag}
            </span>
          )}
          {topic.week && (
            <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
              {topic.week}
            </span>
          )}
        </div>
        {topic.description && (
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2, lineHeight: 1.5 }}>
            {topic.description}
          </div>
        )}
      </div>
    </button>
  )
}
