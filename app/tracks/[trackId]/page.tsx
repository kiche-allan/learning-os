import { TRACK_META } from '@/lib/data'
import TrackPageClient from './TrackPageClient'

export function generateStaticParams() {
  return Object.keys(TRACK_META).map((trackId) => ({ trackId }))
}

export default async function TrackPage({ params }: { params: Promise<{ trackId: string }> }) {
  const { trackId } = await params
  return <TrackPageClient trackId={trackId} />
}
