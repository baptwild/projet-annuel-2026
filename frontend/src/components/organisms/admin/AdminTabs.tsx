'use client'

import React from 'react'
import { Section } from '@/utils/adminHelpers'

interface AdminTabsProps {
  activeSection: Section
  setActiveSection: (section: Section) => void
  pendingCount: number
}

export default function AdminTabs({ activeSection, setActiveSection, pendingCount }: AdminTabsProps) {
  const componentsClass = 'o_AdminTabs'
  const parentClass = 'p_Admin'

  const SECTIONS: { key: Section; label: string; badge?: number | null }[] = [
    { key: 'bookings', label: 'Réservations', badge: pendingCount > 0 ? pendingCount : null },
    { key: 'users', label: 'Utilisateurs' },
    { key: 'dogs', label: 'Chiens' },
    { key: 'schedule', label: 'Horaires' },
    { key: 'theme', label: 'Personnalisation' },
  ]

  return (
    <nav className={`${componentsClass}_nav`}>
      {SECTIONS.map(s => (
        <button
          key={s.key}
          className={`${componentsClass}_navBtn${activeSection === s.key ? ` ${componentsClass}_navBtn-active` : ''}`}
          onClick={() => setActiveSection(s.key)}
        >
          {s.label}
          {s.badge != null && <span className={`${parentClass}_badge`}>{s.badge}</span>}
        </button>
      ))}
    </nav>
  )
}