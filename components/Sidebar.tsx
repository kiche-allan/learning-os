'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TRACK_META } from '@/lib/data'
import { TrackId } from '@/types'

const NAV_TRACKS: TrackId[] = ['devops', 'ai', 'music', 'datascience', 'web', 'reading']

export default function Sidebar() {
  const path = usePathname()

  return (
    <aside style={{
      width: 200,
      flexShrink: 0,
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulse-dot 2s infinite' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text1)' }}>
            LEARNING OS
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', paddingLeft: 16 }}>
          Jun → Dec 2025
        </div>
      </div>

      {/* Overview */}
      <div style={{ padding: '12px 8px 4px' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--text3)', padding: '0 8px 6px', textTransform: 'uppercase' }}>
          Overview
        </div>
        <NavItem href="/" label="Dashboard" icon="◎" active={path === '/'} />
        <NavItem href="/log" label="Log session" icon="+" active={path === '/log'} />
      </div>

      {/* Tracks */}
      <div style={{ padding: '8px 8px 4px' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--text3)', padding: '0 8px 6px', textTransform: 'uppercase' }}>
          Tracks
        </div>
        {NAV_TRACKS.map(id => (
          <NavItem
            key={id}
            href={`/tracks/${id}`}
            label={TRACK_META[id].label}
            icon={TRACK_META[id].icon}
            color={TRACK_META[id].color}
            active={path === `/tracks/${id}`}
          />
        ))}
      </div>

      {/* Bottom */}
      <div style={{ marginTop: 'auto', padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
          26 weeks · 6 tracks
        </div>
      </div>
    </aside>
  )
}

function NavItem({ href, label, icon, color, active }: {
  href: string; label: string; icon: string; color?: string; active: boolean
}) {
  return (
    <Link href={href} style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '7px 8px', borderRadius: 6,
      background: active ? 'var(--bg3)' : 'transparent',
      color: active ? 'var(--text1)' : 'var(--text2)',
      textDecoration: 'none', fontSize: 13,
      fontWeight: active ? 500 : 400,
      transition: 'all 0.15s',
      marginBottom: 1,
      position: 'relative',
      borderLeft: active ? `2px solid ${color || '#22c55e'}` : '2px solid transparent',
    }}>
      <span style={{ fontSize: 12, color: color || (active ? 'var(--text1)' : 'var(--text3)'), width: 16, textAlign: 'center' }}>
        {icon}
      </span>
      <span style={{ flex: 1, fontSize: 12 }}>{label}</span>
    </Link>
  )
}
