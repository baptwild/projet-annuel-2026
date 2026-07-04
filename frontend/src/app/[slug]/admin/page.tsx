'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMe } from '@/hooks/useMe'
import { useAdminBookings, AdminBooking } from '@/hooks/useAdminBookings'
import { useAdminUsers, AdminUser, AdminDog } from '@/hooks/useAdminUsers'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'
import { computeBookingCosts, formatCost, BillingMode, BillingConfig, BILLING_MODE_LABELS } from '@/utils/billing'

const API = process.env.NEXT_PUBLIC_API_URL

const DEFAULT_PRIMARY   = '#1D6980'
const DEFAULT_SECONDARY = '#01B4B8'
const DEFAULT_TERTIARY  = '#2F4858'

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
  { key: 'completed', label: 'Terminées' },
  { key: 'cancelled', label: 'Annulées' },
  { key: 'all',       label: 'Toutes' },
] as const

type StatusFilter = typeof STATUS_TABS[number]['key']
type Section = 'bookings' | 'users' | 'dogs' | 'schedule' | 'theme'

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

function getWeekBounds(offset: number): { start: Date; end: Date; label: string } {
  const now = new Date()
  const dayOfWeek = (now.getDay() + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek + offset * 7)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  return { start: monday, end: sunday, label: `${fmt(monday)} – ${fmt(sunday)} ${sunday.getFullYear()}` }
}

// Booking card
function BookingCard({ booking, onConfirm, onCancel, onComplete }: {
  booking: AdminBooking
  onConfirm: () => void
  onCancel: () => void
  onComplete: () => void
}) {
  const start = formatDateTime(booking.startDate)
  const end = formatDateTime(booking.endDate)
  const owner = booking.dog.owner
  const ownerName = [owner.firstName, owner.lastName].filter(Boolean).join(' ') || owner.email
  const isEndPast = new Date(booking.endDate) < new Date(new Date().toDateString())
  const canComplete = booking.status === 'confirmed' && isEndPast
  const componentsClass = 'p_Admin_booking'
  return (
    <div className={`${componentsClass} ${componentsClass}-${booking.status}`}>
      <div className={`${componentsClass}-dog`}>
        <span className={`${componentsClass}-dogName`}>{booking.dog.name}</span>
        {booking.dog.breed && <span className={`${componentsClass}-breed`}>{booking.dog.breed}</span>}
      </div>
      <div className={`${componentsClass}-owner`}>
        <i className='bi bi-person' />
        <span>{ownerName}</span>
        <span className={`${componentsClass}-email`}>{owner.email}</span>
      </div>
      <div className={`${componentsClass}-schedule`}>
        <i className='bi bi-calendar3' />
        <span>{start.date}</span>
        <span className={`${componentsClass}-times`}>{start.time} → {end.time}</span>
      </div>
      <div className={`${componentsClass}-footer`}>
        <span className={`${componentsClass}-status`}>{STATUS_LABELS[booking.status] ?? booking.status}</span>
        <div className={`${componentsClass}-actions`}>
          {booking.status === 'pending' && (
            <button className={`${componentsClass}-btn ${componentsClass}-btn-confirm`} onClick={onConfirm}>
              <i className='bi bi-check-lg' /> Confirmer
            </button>
          )}
          {canComplete && (
            <button className={`${componentsClass}-btn ${componentsClass}-btn-complete`} onClick={onComplete}>
              <i className='bi bi-flag-fill' /> Terminer
            </button>
          )}
          {(booking.status === 'pending' || booking.status === 'confirmed') && (
            <button className={`${componentsClass}-btn ${componentsClass}-btn-cancel`} onClick={onCancel}>
              <i className='bi bi-x-lg' /> Annuler
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// User card
function UserCard({ user, dogCount }: { user: AdminUser; dogCount: number }) {
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
  const isAdmin = user.roles.includes('ROLE_ADMIN')
  const componentsClass = 'p_Admin_user'
  return (
    <div className={componentsClass}>
      <div className={`${componentsClass}-avatar`}>
        <i className={`bi ${isAdmin ? 'bi-shield-check' : 'bi-person'}`} />
      </div>
      <div className={`${componentsClass}-info`}>
        <span className={`${componentsClass}-name`}>{displayName}</span>
        <span className={`${componentsClass}-email`}>{user.email}</span>
      </div>
      <div className={`${componentsClass}-meta`}>
        <span className={`${componentsClass}-role${isAdmin ? ` ${componentsClass}-role-admin` : ''}`}>
          {isAdmin ? 'Admin' : 'Utilisateur'}
        </span>
        {!isAdmin && (
          <span className={`${componentsClass}-dogs`}>
            <i className='bi bi-heart' /> {dogCount} chien{dogCount > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}

// Dog card
function DogCard({ dog, ownerName, ownerEmail }: { dog: AdminDog; ownerName: string; ownerEmail: string }) {
  const componentsClass = 'p_Admin_dog'
  return (
    <div className={componentsClass}>
      <div className={`${componentsClass}-avatar`}>
        <i className='bi bi-heart' />
      </div>
      <div className={`${componentsClass}-info`}>
        <span className={`${componentsClass}-name`}>{dog.name}</span>
        {dog.breed && <span className={`${componentsClass}-breed`}>{dog.breed}</span>}
        {dog.birthDate && (
          <span className={`${componentsClass}-birth`}>
            Né le {new Date(dog.birthDate).toLocaleDateString('fr-FR')}
          </span>
        )}
      </div>
      <div className={`${componentsClass}-owner`}>
        <i className='bi bi-person' />
        <span>{ownerName}</span>
        <span className={`${componentsClass}-ownerEmail`}>{ownerEmail}</span>
      </div>
    </div>
  )
}

// Page principale
export default function AdminPage() {
  const router = useRouter()
  const params = useParams()
  const { me, loading: meLoading } = useMe()
  const { bookings, loading: bookingsLoading, updateStatus } = useAdminBookings()
  const { users, dogs, loading: usersLoading } = useAdminUsers()

  const [activeSection, setActiveSection] = useState<Section>('bookings')

  const [daycareId, setDaycareId] = useState<number | null>(null)
  const [openingTime, setOpeningTime] = useState('')
  const [closingTime, setClosingTime] = useState('')
  const [openDays, setOpenDays] = useState<number[]>([1, 2, 3, 4, 5])
  const [billingMode, setBillingMode] = useState<BillingMode>('hourly')
  const [pricePerUnit, setPricePerUnit] = useState<number>(0)
  const [priceHalfDay, setPriceHalfDay] = useState<number>(0)
  const [tierEnabled, setTierEnabled] = useState(false)
  const [tierHoursThreshold, setTierHoursThreshold] = useState<number>(4)
  const [tierPrice, setTierPrice] = useState<number>(0)
  const [weeklyDiscountEnabled, setWeeklyDiscountEnabled] = useState(false)
  const [weeklyDiscountThreshold, setWeeklyDiscountThreshold] = useState(3)
  const [weeklyDiscountPercent, setWeeklyDiscountPercent] = useState<number>(10)
  const [maxDogsPerDay, setMaxDogsPerDay] = useState<number | null>(null)
  const [scheduleSuccess, setScheduleSuccess] = useState(false)
  const [scheduleError, setScheduleError] = useState<string | null>(null)
  const [scheduleSaving, setScheduleSaving] = useState(false)

  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [facebook, setFacebook] = useState('')
  const [instagram, setInstagram] = useState('')
  const [colorPrimary, setColorPrimary] = useState(DEFAULT_PRIMARY)
  const [colorSecondary, setColorSecondary] = useState(DEFAULT_SECONDARY)
  const [colorTertiary, setColorTertiary] = useState(DEFAULT_TERTIARY)
  const [themeSuccess, setThemeSuccess] = useState(false)
  const [themeError, setThemeError] = useState<string | null>(null)
  const [themeSaving, setThemeSaving] = useState(false)

  const [filter, setFilter] = useState<StatusFilter>('pending')
  const [weekOffset, setWeekOffset] = useState(0)

  useEffect(() => {
    if (meLoading) return

    if (!me) {
      router.push(`/${params.slug}/login`)
      return
    }

    if (!me.roles.includes('ROLE_ADMIN')) {
      router.push(`/${params.slug}`)
      return
    }

    if (me.daycare?.slug !== params.slug) {
      console.warn("Accès refusé: Vous n'êtes pas l'administrateur de ce parc.");
      router.push(`/${me.daycare.slug}/admin`)
      return
    }
  }, [meLoading, me, router, params.slug])

  useEffect(() => {
    if (!me) return
    const d = me.daycare
    setDaycareId(d.id)
    setOpeningTime(d.openingTime)
    setClosingTime(d.closingTime)
    setOpenDays(d.openDays ?? [1, 2, 3, 4, 5])
    setBillingMode((d.billingMode as BillingMode) ?? 'hourly')
    setPricePerUnit(d.pricePerUnit ?? 0)
    setPriceHalfDay(d.priceHalfDay ?? 0)
    setTierEnabled(d.tierHoursThreshold != null)
    setTierHoursThreshold(d.tierHoursThreshold ?? 4)
    setTierPrice(d.tierPrice ?? 0)
    setWeeklyDiscountEnabled(d.weeklyDiscountEnabled ?? false)
    setWeeklyDiscountThreshold(d.weeklyDiscountThreshold ?? 3)
    setWeeklyDiscountPercent(d.weeklyDiscountPercent ?? 10)
    setMaxDogsPerDay(d.maxDogsPerDay ?? null)
    setAddress(d.address ?? '')
    setPhone(d.phone ?? '')
    setEmail(d.email ?? '')
    setFacebook(d.facebook ?? '')
    setInstagram(d.instagram ?? '')
    setColorPrimary(d.colorPrimary ?? DEFAULT_PRIMARY)
    setColorSecondary(d.colorSecondary ?? DEFAULT_SECONDARY)
    setColorTertiary(d.colorTertiary ?? DEFAULT_TERTIARY)
  }, [me])

  // PATCH: schedule
  const handleScheduleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!daycareId) return
    setScheduleSaving(true)
    setScheduleSuccess(false)
    setScheduleError(null)
    const token = localStorage.getItem('token')
    const res = await fetch(`${API}/api/daycares/${daycareId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/merge-patch+json' },
      body: JSON.stringify({
        openingTime,
        closingTime,
        openDays,
        billingMode,
        pricePerUnit,
        priceHalfDay,
        tierHoursThreshold: tierEnabled ? tierHoursThreshold : null,
        tierPrice: tierEnabled ? tierPrice : null,
        weeklyDiscountEnabled,
        weeklyDiscountThreshold,
        weeklyDiscountPercent,
        maxDogsPerDay,
      }),
    })
    setScheduleSaving(false)
    if (res.ok) setScheduleSuccess(true)
    else setScheduleError('Erreur lors de la mise à jour.')
  }

  // PATCH: theme
  const handleThemeSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!daycareId) return
    setThemeSaving(true)
    setThemeSuccess(false)
    setThemeError(null)
    const token = localStorage.getItem('token')
    const res = await fetch(`${API}/api/daycares/${daycareId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/merge-patch+json' },
      body: JSON.stringify({
        address,
        phone,
        email,
        facebook,
        instagram,
        colorPrimary,
        colorSecondary,
        colorTertiary,
      }),
    })
    setThemeSaving(false)
    if (res.ok) {
      setThemeSuccess(true)
      const root = document.documentElement
      root.style.setProperty('--color-primary',   colorPrimary)
      root.style.setProperty('--color-secondary', colorSecondary)
      root.style.setProperty('--color-tertiary', colorTertiary)
      router.refresh()
    } else {
      setThemeError('Erreur lors de la mise à jour.')
    }
  }

  const week = getWeekBounds(weekOffset)
  const inWeek = (b: AdminBooking) => {
    const d = new Date(b.startDate)
    return d >= week.start && d <= week.end
  }
  const byStatus = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)
  const filtered = byStatus.filter(inWeek)
  const pendingCount = bookings.filter(b => b.status === 'pending').length
  const pendingThisWeek = bookings.filter(b => b.status === 'pending' && inWeek(b)).length
  const closingSlots = ALL_SLOTS.filter(t => t > openingTime)

  const billingConfig: BillingConfig = {
    billingMode, pricePerUnit, priceHalfDay,
    tierHoursThreshold: tierEnabled ? tierHoursThreshold : null,
    tierPrice: tierEnabled ? tierPrice : null,
    weeklyDiscountEnabled, weeklyDiscountThreshold, weeklyDiscountPercent,
  }

  const now = new Date()
  const inCurrentMonth = (b: AdminBooking) => {
    const d = new Date(b.startDate)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }
  const allMonthCosts = computeBookingCosts(
    bookings.filter(b => b.status !== 'cancelled' && inCurrentMonth(b)),
    billingConfig,
  )
  const completedRevenue = allMonthCosts.filter(b => b.status === 'completed').reduce((s, b) => s + b.finalCost, 0)
  const upcomingRevenue  = allMonthCosts.filter(b => b.status !== 'completed').reduce((s, b) => s + b.finalCost, 0)
  const totalRevenue = completedRevenue + upcomingRevenue
  const completedCount = allMonthCosts.filter(b => b.status === 'completed').length
  const upcomingCount  = allMonthCosts.filter(b => b.status !== 'completed').length
  const hasPrice = pricePerUnit > 0 || priceHalfDay > 0
  const userMap = new Map(users.map(u => [u['@id'], u]))

  const componentsClass = 'p_Admin'

  if (meLoading) return <div className={`${componentsClass} ${componentsClass}-loading`}>Chargement...</div>
  if (!me) return null

  const SECTIONS: { key: Section; label: string; badge?: number | null }[] = [
    { key: 'bookings', label: 'Réservations', badge: pendingCount > 0 ? pendingCount : null },
    { key: 'users',    label: 'Utilisateurs' },
    { key: 'dogs',     label: 'Chiens' },
    { key: 'schedule', label: 'Horaires' },
    { key: 'theme',    label: 'Personnalisation' },
  ]

  return (
    <div className={componentsClass}>
      <div className={`${componentsClass}_header`}>
        <h1 className={`${componentsClass}_title`}>Administration</h1>
        <p className={`${componentsClass}_daycare`}>{me.daycare.name}</p>
      </div>

      <nav className={`${componentsClass}_nav`}>
        {SECTIONS.map(s => (
          <button
            key={s.key}
            className={`${componentsClass}_navBtn${activeSection === s.key ? ` ${componentsClass}_navBtn-active` : ''}`}
            onClick={() => setActiveSection(s.key)}
          >
            {s.label}
            {s.badge != null && <span className={`${componentsClass}_badge`}>{s.badge}</span>}
          </button>
        ))}
      </nav>

      {/* ── Réservations ── */}
      {activeSection === 'bookings' && (
        <section className={`${componentsClass}_section`}>
          {hasPrice && (
            <div className={`${componentsClass}_revenue`}>
              <div className={`${componentsClass}_revenueTotal`}>{formatCost(totalRevenue)}</div>
              <div className={`${componentsClass}_revenueLabel`}>
                Total du mois · {BILLING_MODE_LABELS[billingMode]}
                {weeklyDiscountEnabled && ` · remise −${weeklyDiscountPercent}% dès ${weeklyDiscountThreshold} rés./semaine`}
              </div>
              <div className={`${componentsClass}_revenueBreakdown`}>
                <div className={`${componentsClass}_revenueItem`}>
                  <span className={`${componentsClass}_revenueItemLabel`}>Réalisé</span>
                  <span className={`${componentsClass}_revenueItemAmount ${componentsClass}_revenueItemAmount-done`}>{formatCost(completedRevenue)}</span>
                  <span className={`${componentsClass}_revenueItemCount`}>{completedCount} terminée{completedCount > 1 ? 's' : ''}</span>
                </div>
                <div className={`${componentsClass}_revenueSep`} />
                <div className={`${componentsClass}_revenueItem`}>
                  <span className={`${componentsClass}_revenueItemLabel`}>À venir</span>
                  <span className={`${componentsClass}_revenueItemAmount ${componentsClass}_revenueItemAmount-upcoming`}>{formatCost(upcomingRevenue)}</span>
                  <span className={`${componentsClass}_revenueItemCount`}>{upcomingCount} réservation{upcomingCount > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          )}
          <div className={`${componentsClass}_weekNav`}>
            <button className={`${componentsClass}_weekBtn`} onClick={() => setWeekOffset(o => o - 1)}>
              <i className='bi bi-chevron-left' />
            </button>
            <div className={`${componentsClass}_weekLabel`}>
              <span>{week.label}</span>
              {weekOffset !== 0 && (
                <button className={`${componentsClass}_weekToday`} onClick={() => setWeekOffset(0)}>Aujourd'hui</button>
              )}
            </div>
            <button className={`${componentsClass}_weekBtn`} onClick={() => setWeekOffset(o => o + 1)}>
              <i className='bi bi-chevron-right' />
            </button>
          </div>
          <div className={`${componentsClass}_tabs`}>
            {STATUS_TABS.map(tab => (
              <button
                key={tab.key}
                className={`${componentsClass}_tab${filter === tab.key ? ` ${componentsClass}_tab-active` : ''}`}
                onClick={() => setFilter(tab.key)}
              >
                {tab.label}
                {tab.key === 'pending' && pendingThisWeek > 0 && ` (${pendingThisWeek})`}
              </button>
            ))}
          </div>
          {bookingsLoading ? (
            <p className={`${componentsClass}_empty`}>Chargement...</p>
          ) : filtered.length === 0 ? (
            <p className={`${componentsClass}_empty`}>Aucune réservation cette semaine.</p>
          ) : (
            <div className={`${componentsClass}_bookings`}>
              {filtered.map(b => (
                <BookingCard
                  key={b['@id']}
                  booking={b}
                  onConfirm={() => updateStatus(b['@id'], 'confirmed')}
                  onCancel={() => updateStatus(b['@id'], 'cancelled')}
                  onComplete={() => updateStatus(b['@id'], 'completed')}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Utilisateurs ── */}
      {activeSection === 'users' && (
        <section className={`${componentsClass}_section`}>
          {usersLoading ? (
            <p className={`${componentsClass}_empty`}>Chargement...</p>
          ) : users.length === 0 ? (
            <p className={`${componentsClass}_empty`}>Aucun utilisateur.</p>
          ) : (
            <div className={`${componentsClass}_list`}>
              {users.map(u => (
                <UserCard key={u['@id']} user={u} dogCount={dogs.filter(d => d.owner === u['@id']).length} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Chiens ── */}
      {activeSection === 'dogs' && (
        <section className={`${componentsClass}_section`}>
          {usersLoading ? (
            <p className={`${componentsClass}_empty`}>Chargement...</p>
          ) : dogs.length === 0 ? (
            <p className={`${componentsClass}_empty`}>Aucun chien.</p>
          ) : (
            <div className={`${componentsClass}_list`}>
              {dogs.map(d => {
                const owner = userMap.get(d.owner)
                const ownerName = owner ? [owner.firstName, owner.lastName].filter(Boolean).join(' ') || owner.email : '—'
                return <DogCard key={d['@id']} dog={d} ownerName={ownerName} ownerEmail={owner?.email ?? '—'} />
              })}
            </div>
          )}
        </section>
      )}

      {/* ── Horaires ── */}
      {activeSection === 'schedule' && (
        <section className={`${componentsClass}_section`}>
          <form className={`${componentsClass}_form`} onSubmit={handleScheduleSubmit}>
            <div className={`${componentsClass}_times`}>
              <div className={`${componentsClass}_field`}>
                <label className={`${componentsClass}_label`}>Ouverture</label>
                <select className={`${componentsClass}_select`} value={openingTime} onChange={e => setOpeningTime(e.target.value)} required>
                  {ALL_SLOTS.filter(t => t < closingTime || !closingTime).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className={`${componentsClass}_field`}>
                <label className={`${componentsClass}_label`}>Fermeture</label>
                <select className={`${componentsClass}_select`} value={closingTime} onChange={e => setClosingTime(e.target.value)} required>
                  {closingSlots.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className={`${componentsClass}_field`}>
              <label className={`${componentsClass}_label`}>Jours d'ouverture</label>
              <div className={`${componentsClass}_days`}>
                {WEEK_DAYS.map(day => (
                  <label key={day.value} className={`${componentsClass}_day`}>
                    <input
                      type='checkbox'
                      checked={openDays.includes(day.value)}
                      onChange={e => {
                        if (e.target.checked) setOpenDays(prev => [...prev, day.value])
                        else setOpenDays(prev => prev.filter(v => v !== day.value))
                      }}
                    />
                    {day.label}
                  </label>
                ))}
              </div>
            </div>
            <div className={`${componentsClass}_field`}>
              <label className={`${componentsClass}_label`}>Mode de facturation</label>
              <select className={`${componentsClass}_select`} value={billingMode} onChange={e => setBillingMode(e.target.value as BillingMode)}>
                {(Object.entries(BILLING_MODE_LABELS) as [BillingMode, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            {billingMode === 'hourly' ? (
              <>
                <div className={`${componentsClass}_field`}>
                  <label className={`${componentsClass}_label`}>Tarif de base</label>
                  <div className={`${componentsClass}_inputRow`}>
                    <input className={`${componentsClass}_select`} type='number' min='0' step='0.5' value={pricePerUnit}
                      onChange={e => setPricePerUnit(parseFloat(e.target.value) || 0)} />
                    <span className={`${componentsClass}_inputUnit`}>€ / heure</span>
                  </div>
                </div>
                <label className={`${componentsClass}_toggle`}>
                  <input type='checkbox' checked={tierEnabled} onChange={e => setTierEnabled(e.target.checked)} />
                  <span>Tarif dégressif au-delà d'un certain nombre d'heures</span>
                </label>
                {tierEnabled && (
                  <div className={`${componentsClass}_tier`}>
                    <span className={`${componentsClass}_tierLabel`}>Au-delà de</span>
                    <input className={`${componentsClass}_tierInput`} type='number' min='1' step='0.5' value={tierHoursThreshold}
                      onChange={e => setTierHoursThreshold(parseFloat(e.target.value) || 1)} />
                    <span className={`${componentsClass}_tierLabel`}>h →</span>
                    <input className={`${componentsClass}_tierInput`} type='number' min='0' step='0.5' value={tierPrice}
                      onChange={e => setTierPrice(parseFloat(e.target.value) || 0)} />
                    <span className={`${componentsClass}_tierLabel`}>€ / heure</span>
                  </div>
                )}
              </>
            ) : (
              <div className={`${componentsClass}_times`}>
                <div className={`${componentsClass}_field`}>
                  <label className={`${componentsClass}_label`}>Demi-journée {'<'} 4h</label>
                  <div className={`${componentsClass}_inputRow`}>
                    <input className={`${componentsClass}_select`} type='number' min='0' step='0.5' value={priceHalfDay}
                      onChange={e => setPriceHalfDay(parseFloat(e.target.value) || 0)} />
                    <span className={`${componentsClass}_inputUnit`}>€</span>
                  </div>
                </div>
                <div className={`${componentsClass}_field`}>
                  <label className={`${componentsClass}_label`}>Journée complète ≥ 4h</label>
                  <div className={`${componentsClass}_inputRow`}>
                    <input className={`${componentsClass}_select`} type='number' min='0' step='0.5' value={pricePerUnit}
                      onChange={e => setPricePerUnit(parseFloat(e.target.value) || 0)} />
                    <span className={`${componentsClass}_inputUnit`}>€</span>
                  </div>
                </div>
              </div>
            )}
            <div className={`${componentsClass}_divider`} />
            <label className={`${componentsClass}_toggle`}>
              <input type='checkbox' checked={weeklyDiscountEnabled} onChange={e => setWeeklyDiscountEnabled(e.target.checked)} />
              <span>Remise hebdomadaire</span>
            </label>
            {weeklyDiscountEnabled && (
              <div className={`${componentsClass}_tier`}>
                <span className={`${componentsClass}_tierLabel`}>À partir de</span>
                <input className={`${componentsClass}_tierInput`} type='number' min='2' step='1' value={weeklyDiscountThreshold}
                  onChange={e => setWeeklyDiscountThreshold(parseInt(e.target.value) || 2)} />
                <span className={`${componentsClass}_tierLabel`}>réservations/semaine →</span>
                <input className={`${componentsClass}_tierInput`} type='number' min='0' max='100' step='1' value={weeklyDiscountPercent}
                  onChange={e => setWeeklyDiscountPercent(parseFloat(e.target.value) || 0)} />
                <span className={`${componentsClass}_tierLabel`}>% de remise</span>
              </div>
            )}
            <div className={`${componentsClass}_divider`} />
            <div className={`${componentsClass}_field`}>
              <label className={`${componentsClass}_label`}>Capacité maximale par jour</label>
              <div className={`${componentsClass}_inputRow`}>
                <input className={`${componentsClass}_select`} type='number' min='1' step='1' placeholder='Illimitée'
                  value={maxDogsPerDay ?? ''}
                  onChange={e => setMaxDogsPerDay(e.target.value === '' ? null : parseInt(e.target.value))} />
                <span className={`${componentsClass}_inputUnit`}>chiens / jour</span>
              </div>
              <span className={`${componentsClass}_fieldHint`}>Laisser vide pour aucune limite</span>
            </div>
            {scheduleSuccess && <p className={`${componentsClass}_success`}>Paramètres mis à jour.</p>}
            {scheduleError   && <p className={`${componentsClass}_error`}>{scheduleError}</p>}
            <Button label={scheduleSaving ? 'Enregistrement...' : 'Enregistrer'} type='submit' color={ColorButton.PRIMARY} className={`${componentsClass}_submit`} />
          </form>
        </section>
      )}

      {/* ── Personnalisation ── */}
      {activeSection === 'theme' && (
        <section className={`${componentsClass}_section`}>
          <form className={`${componentsClass}_form`} onSubmit={handleThemeSubmit}>

            <h3 className={`${componentsClass}_sectionTitle`}>Informations de contact</h3>

            <div className={`${componentsClass}_field`}>
              <label className={`${componentsClass}_label`}>Adresse postale</label>
              <input className={`${componentsClass}_select`} type='text' value={address}
                onChange={e => setAddress(e.target.value)} placeholder='12 rue des Chiens, 38000 Grenoble' />
            </div>
            <div className={`${componentsClass}_field`}>
              <label className={`${componentsClass}_label`}>Téléphone</label>
              <input className={`${componentsClass}_select`} type='tel' value={phone}
                onChange={e => setPhone(e.target.value)} placeholder='01 23 45 67 89' />
            </div>
            <div className={`${componentsClass}_field`}>
              <label className={`${componentsClass}_label`}>Email de contact</label>
              <input className={`${componentsClass}_select`} type='email' value={email}
                onChange={e => setEmail(e.target.value)} placeholder='contact@garderie.fr' />
            </div>

            <div className={`${componentsClass}_divider`} />
            <h3 className={`${componentsClass}_sectionTitle`}>Réseaux sociaux</h3>

            <div className={`${componentsClass}_field`}>
              <label className={`${componentsClass}_label`}><i className='bi bi-facebook' /> Facebook</label>
              <input className={`${componentsClass}_select`} type='url' value={facebook}
                onChange={e => setFacebook(e.target.value)} placeholder='https://facebook.com/...' />
            </div>
            <div className={`${componentsClass}_field`}>
              <label className={`${componentsClass}_label`}><i className='bi bi-instagram' /> Instagram</label>
              <input className={`${componentsClass}_select`} type='url' value={instagram}
                onChange={e => setInstagram(e.target.value)} placeholder='https://instagram.com/...' />
            </div>

            <div className={`${componentsClass}_divider`} />
            <h3 className={`${componentsClass}_sectionTitle`}>Couleurs de la plateforme</h3>
            <p className={`${componentsClass}_fieldHint`}>Ces couleurs s'appliquent à l'ensemble du site. Elles sont visibles immédiatement après l'enregistrement.</p>

            <div className={`${componentsClass}_colorGrid`}>
              {([
                { label: 'Couleur primaire', value: colorPrimary, set: setColorPrimary },
                { label: 'Couleur secondaire', value: colorSecondary, set: setColorSecondary },
                { label: 'Couleur tertiaire', value: colorTertiary, set: setColorTertiary },
              ] as const).map(({ label, value, set }) => (
                <div key={label} className={`${componentsClass}_field`}>
                  <label className={`${componentsClass}_label`}>{label}</label>
                  <div className={`${componentsClass}_colorRow`}>
                    <input type='color' className={`${componentsClass}_colorPicker`} value={value}
                      onChange={e => set(e.target.value)} />
                    <input type='text' className={`${componentsClass}_select`} value={value} maxLength={7}
                      onChange={e => set(e.target.value)} placeholder='#000000' />
                  </div>
                </div>
              ))}
            </div>

            <div className={`${componentsClass}_colorPreview`}>
              <span className={`${componentsClass}_colorPreviewChip`} style={{ background: colorPrimary }}   title='Primaire' />
              <span className={`${componentsClass}_colorPreviewChip`} style={{ background: colorSecondary }} title='Secondaire' />
              <span className={`${componentsClass}_colorPreviewChip`} style={{ background: colorTertiary }}  title='Tertiaire' />
              <span className={`${componentsClass}_colorPreviewLabel`}>Aperçu</span>
            </div>

            {themeSuccess && <p className={`${componentsClass}_success`}>Thème mis à jour.</p>}
            {themeError   && <p className={`${componentsClass}_error`}>{themeError}</p>}
            <Button label={themeSaving ? 'Enregistrement...' : 'Enregistrer le thème'} type='submit' color={ColorButton.PRIMARY} className={`${componentsClass}_submit`} />
          </form>
        </section>
      )}
    </div>
  )
}
