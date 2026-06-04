'use client'
import { useState, useEffect, useCallback } from 'react'
import { AppState, LogEntry, TrackId } from '@/types'

const DEFAULT_STATE: AppState = {
  completedTopics: ['ai0'],
  logEntries: [],
  bookProgress: {},
  bookStatuses: { b1: 'reading' },
  streak: 0,
  lastLogDate: null,
}

export function useAppState() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('learning-os-v1')
      if (saved) setState({ ...DEFAULT_STATE, ...JSON.parse(saved) })
    } catch {}
    setHydrated(true)
  }, [])

  const save = useCallback((next: AppState) => {
    setState(next)
    try { localStorage.setItem('learning-os-v1', JSON.stringify(next)) } catch {}
  }, [])

  const toggleTopic = useCallback((topicId: string) => {
    setState(prev => {
      const has = prev.completedTopics.includes(topicId)
      const next = {
        ...prev,
        completedTopics: has
          ? prev.completedTopics.filter(t => t !== topicId)
          : [...prev.completedTopics, topicId],
      }
      try { localStorage.setItem('learning-os-v1', JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const addLog = useCallback((entry: Omit<LogEntry, 'id'>) => {
    setState(prev => {
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      let streak = prev.streak
      if (entry.date === today && prev.lastLogDate !== today) {
        streak = prev.lastLogDate === yesterday ? streak + 1 : 1
      }
      const next = {
        ...prev,
        logEntries: [{ ...entry, id: Date.now().toString() }, ...prev.logEntries],
        streak,
        lastLogDate: entry.date === today ? today : prev.lastLogDate,
      }
      try { localStorage.setItem('learning-os-v1', JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const setBookProgress = useCallback((bookId: string, progress: number) => {
    setState(prev => {
      const next = {
        ...prev,
        bookProgress: { ...prev.bookProgress, [bookId]: progress },
        bookStatuses: {
          ...prev.bookStatuses,
          [bookId]: progress === 100 ? 'done' : progress > 0 ? 'reading' : (prev.bookStatuses[bookId] ?? 'queued'),
        },
      }
      try { localStorage.setItem('learning-os-v1', JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const getTrackProgress = useCallback((trackId: TrackId, allTopics: { id: string }[]) => {
    if (!allTopics.length) return 0
    const done = allTopics.filter(t => state.completedTopics.includes(t.id)).length
    return Math.round((done / allTopics.length) * 100)
  }, [state.completedTopics])

  const getWeeklyMinutes = useCallback(() => {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    weekStart.setHours(0, 0, 0, 0)
    return state.logEntries
      .filter(e => new Date(e.date) >= weekStart)
      .reduce((s, e) => s + e.minutes, 0)
  }, [state.logEntries])

  return { state, hydrated, toggleTopic, addLog, setBookProgress, getTrackProgress, getWeeklyMinutes }
}
