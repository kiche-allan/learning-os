export type TrackId = 'devops' | 'ai' | 'music' | 'datascience' | 'web' | 'reading'

export interface Topic {
  id: string
  title: string
  description?: string
  week?: string
  tag?: string
  phase: number
}

export interface Book {
  id: string
  title: string
  author: string
  year: number
  pages: number
  why: string
  tags: string[]
  color: string
  status: 'queued' | 'reading' | 'done'
}

export interface LogEntry {
  id: string
  trackId: TrackId
  minutes: number
  date: string
  note: string
}

export interface AppState {
  completedTopics: string[]
  logEntries: LogEntry[]
  bookProgress: Record<string, number>
  bookStatuses: Record<string, Book['status']>
  streak: number
  lastLogDate: string | null
}
