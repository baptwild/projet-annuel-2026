'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMe } from '@/hooks/useMe'
import { useAdminBookings, AdminBooking } from '@/hooks/useAdminBookings'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'

const API = process.env.NEXT_PUBLIC_API_URL

function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = 0; h <= 23; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
    slots.push(`${String(h).padStart(2, '0')}:30`)
  }
  return slots
}

const ALL_SLOTS = generateTimeSlots()

const WEEK_DAYS = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' },
]

const STATUS_TABS = [
  { key: 'pending',   label: 'En attente' },
  { key: 'confirmed', label: 'Confirmées' },
  { key: 'cancelled', label: 'Annulées' },
  { key: 'all',       label: 'Toutes' },
] as const

type StatusFilter = typeof STATUS_TABS[number]['key']

const STATUS_LABELS: Record<string, string> = {
  pending:   'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
  completed: 'Terminée',
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
    time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  }
}

function BookingCard({ booking, onConfirm, onCancel }: {
  booking: AdminBooking
  onConfirm: () => void
  onCancel: () => void
}) {
  const start = formatDateTime(booking.startDate)
  const end = formatDateTime(booking.endDate)
  const owner = booking.dog.owner
  const ownerName = [owner.firstName, owner.lastName].filter(Boolean).join(' ') || owner.email

  const c = 'p_Admin_booking'
  return (
    <div className={`${c} ${c}-${booking.status}`}>
      <div className={`${c}-dog`}>
        <span className={`${c}-dogName`}>{booking.dog.name}</span>
        {booking.dog.breed && <span className={`${c}-breed`}>{booking.dog.breed}</span>}
      </div>

      <div className={`${c}-owner`}>
        <i className='bi bi-person' />
        <span>{ownerName}</span>
        <span className={`${c}-email`}>{owner.email}</span>
      </div>

      <div className={`${c}-schedule`}>
        <i className='bi bi-calendar3' />
        <span>{start.date}</span>
        <span className={`${c}-times`}>{start.time} → {end.time}</span>
      </div>

      <div className={`${c}-footer`}>
        <span className={`${c}-status`}>{STATUS_LABELS[booking.status] ?? booking.status}</span>
        <div className={`${c}-actions`}>
          {booking.status === 'pending' && (
            <button className={`${c}-btn ${c}-btn-confirm`} onClick={onConfirm}>
              <i className='bi bi-check-lg' /> Confirmer
            </button>
          )}
          {(booking.status === 'pending' || booking.status === 'confirmed') && (
            <button className={`${c}-btn ${c}-btn-cancel`} onClick={onCancel}>
              <i className='bi bi-x-lg' /> Annuler
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const { me, loading: meLoading } = useMe()
  const { bookings, loading: bookingsLoading, updateStatus } = useAdminBookings()

  const [daycareId, setDaycareId] = useState<number | null>(null)
  const [openingTime, setOpeningTime] = useState('')
  const [closingTime, setClosingTime] = useState('')
  const [openDays, setOpenDays] = useState<number[]>([1, 2, 3, 4, 5])
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<StatusFilter>('pending')

  useEffect(() => {
    if (!meLoading && !me) router.push('/')
    if (!meLoading && me && !me.roles.includes('ROLE_ADMIN')) router.push('/')
  }, [meLoading, me, router])

  useEffect(() => {
    if (me) {
      setDaycareId(me.daycare.id)
      setOpeningTime(me.daycare.openingTime)
      setClosingTime(me.daycare.closingTime)
      setOpenDays(me.daycare.openDays ?? [1, 2, 3, 4, 5])
    }
  }, [me])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!daycareId) return
    setSaving(true); setSuccess(false); setError(null)
    const token = localStorage.getItem('token')
    const res = await fetch(`${API}/api/daycares/${daycareId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/merge-patch+json' },
      body: JSON.stringify({ openingTime, closingTime, openDays }),
    })
    setSaving(false)
    if (res.ok) setSuccess(true)
    else setError('Erreur lors de la mise à jour.')
  }

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter)

  const pendingCount = bookings.filter(b => b.status === 'pending').length

  const closingSlots = ALL_SLOTS.filter(t => t > openingTime)
  const c = 'p_Admin'

  if (meLoading) return <div className={`${c} ${c}-loading`}>Chargement...</div>
  if (!me) return null

  return (
    <div className={c}>
      <div className={`${c}_header`}>
        <h1 className={`${c}_title`}>Administration</h1>
        <p className={`${c}_daycare`}>{me.daycare.name}</p>
      </div>

      {/* ── Réservations ── */}
      <section className={`${c}_section`}>
        <h2 className={`${c}_section-title`}>
          Réservations
          {pendingCount > 0 && <span className={`${c}_badge`}>{pendingCount}</span>}
        </h2>

        <div className={`${c}_tabs`}>
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              className={`${c}_tab${filter === tab.key ? ` ${c}_tab-active` : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
              {tab.key === 'pending' && pendingCount > 0 && ` (${pendingCount})`}
            </button>
          ))}
        </div>

        {bookingsLoading ? (
          <p className={`${c}_empty`}>Chargement...</p>
        ) : filtered.length === 0 ? (
          <p className={`${c}_empty`}>Aucune réservation.</p>
        ) : (
          <div className={`${c}_bookings`}>
            {filtered.map(b => (
              <BookingCard
                key={b['@id']}
                booking={b}
                onConfirm={() => updateStatus(b['@id'], 'confirmed')}
                onCancel={() => updateStatus(b['@id'], 'cancelled')}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Horaires ── */}
      <section className={`${c}_section`}>
        <h2 className={`${c}_section-title`}>Horaires d'ouverture</h2>
        <form className={`${c}_form`} onSubmit={handleSubmit}>
          <div className={`${c}_times`}>
            <div className={`${c}_field`}>
              <label className={`${c}_label`}>Ouverture</label>
              <select className={`${c}_select`} value={openingTime} onChange={e => setOpeningTime(e.target.value)} required>
                {ALL_SLOTS.filter(t => t < closingTime || !closingTime).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className={`${c}_field`}>
              <label className={`${c}_label`}>Fermeture</label>
              <select className={`${c}_select`} value={closingTime} onChange={e => setClosingTime(e.target.value)} required>
                {closingSlots.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={`${c}_field`}>
            <label className={`${c}_label`}>Jours d'ouverture</label>
            <div className={`${c}_days`}>
              {WEEK_DAYS.map(day => (
                <label key={day.value} className={`${c}_day`}>
                  <input
                    type='checkbox'
                    checked={openDays.includes(day.value)}
                    onChange={e => {
                      if (e.target.checked) setOpenDays(d => [...d, day.value])
                      else setOpenDays(d => d.filter(v => v !== day.value))
                    }}
                  />
                  {day.label}
                </label>
              ))}
            </div>
          </div>

          {success && <p className={`${c}_success`}>Horaires mis à jour.</p>}
          {error && <p className={`${c}_error`}>{error}</p>}
          <Button label={saving ? 'Enregistrement...' : 'Enregistrer'} type='submit' color={ColorButton.PRIMARY} />
        </form>
      </section>
    </div>
  )
}
