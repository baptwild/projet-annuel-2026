'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMe } from '@/hooks/useMe'
import { useAdminBookings, AdminBooking } from '@/hooks/useAdminBookings'
import { useAdminUsers, AdminUser, AdminDog } from '@/hooks/useAdminUsers'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'
import { computeBookingCosts, formatCost, BillingMode, BillingConfig, BILLING_MODE_LABELS } from '@/utils/billing'

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
  { key: 'completed', label: 'Terminées' },
  { key: 'cancelled', label: 'Annulées' },
  { key: 'all',       label: 'Toutes' },
] as const

type StatusFilter = typeof STATUS_TABS[number]['key']
type Section = 'bookings' | 'users' | 'dogs' | 'schedule'

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
  const dayOfWeek = (now.getDay() + 6) % 7 // 0=lundi
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek + offset * 7)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  const label = `${fmt(monday)} – ${fmt(sunday)} ${sunday.getFullYear()}`
  return { start: monday, end: sunday, label }
}

// ── Booking card ────────────────────────────────────────────────
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
          {canComplete && (
            <button className={`${c}-btn ${c}-btn-complete`} onClick={onComplete}>
              <i className='bi bi-flag-fill' /> Terminer
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

// ── User card ────────────────────────────────────────────────────
function UserCard({ user, dogCount }: { user: AdminUser; dogCount: number }) {
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
  const isAdmin = user.roles.includes('ROLE_ADMIN')
  const c = 'p_Admin_user'
  return (
    <div className={c}>
      <div className={`${c}-avatar`}>
        <i className={`bi ${isAdmin ? 'bi-shield-check' : 'bi-person'}`} />
      </div>
      <div className={`${c}-info`}>
        <span className={`${c}-name`}>{displayName}</span>
        <span className={`${c}-email`}>{user.email}</span>
      </div>
      <div className={`${c}-meta`}>
        <span className={`${c}-role ${isAdmin ? `${c}-role-admin` : ''}`}>
          {isAdmin ? 'Admin' : 'Utilisateur'}
        </span>
        {!isAdmin && (
          <span className={`${c}-dogs`}>
            <i className='bi bi-heart' /> {dogCount} chien{dogCount > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Dog card ─────────────────────────────────────────────────────
function DogCard({ dog, ownerName, ownerEmail }: { dog: AdminDog; ownerName: string; ownerEmail: string }) {
  const c = 'p_Admin_dog'
  return (
    <div className={c}>
      <div className={`${c}-avatar`}>
        <i className='bi bi-heart' />
      </div>
      <div className={`${c}-info`}>
        <span className={`${c}-name`}>{dog.name}</span>
        {dog.breed && <span className={`${c}-breed`}>{dog.breed}</span>}
        {dog.birthDate && (
          <span className={`${c}-birth`}>
            Né le {new Date(dog.birthDate).toLocaleDateString('fr-FR')}
          </span>
        )}
      </div>
      <div className={`${c}-owner`}>
        <i className='bi bi-person' />
        <span>{ownerName}</span>
        <span className={`${c}-ownerEmail`}>{ownerEmail}</span>
      </div>
    </div>
  )
}

// ── Page principale ──────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter()
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
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<StatusFilter>('pending')
  const [weekOffset, setWeekOffset] = useState(0)

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
      setBillingMode((me.daycare.billingMode as BillingMode) ?? 'hourly')
      setPricePerUnit(me.daycare.pricePerUnit ?? 0)
      setPriceHalfDay(me.daycare.priceHalfDay ?? 0)
      setTierEnabled(me.daycare.tierHoursThreshold != null)
      setTierHoursThreshold(me.daycare.tierHoursThreshold ?? 4)
      setTierPrice(me.daycare.tierPrice ?? 0)
      setWeeklyDiscountEnabled(me.daycare.weeklyDiscountEnabled ?? false)
      setWeeklyDiscountThreshold(me.daycare.weeklyDiscountThreshold ?? 3)
      setWeeklyDiscountPercent(me.daycare.weeklyDiscountPercent ?? 10)
      setMaxDogsPerDay(me.daycare.maxDogsPerDay ?? null)
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
      body: JSON.stringify({
        openingTime, closingTime, openDays, billingMode, pricePerUnit,
        priceHalfDay,
        tierHoursThreshold: tierEnabled ? tierHoursThreshold : null,
        tierPrice: tierEnabled ? tierPrice : null,
        weeklyDiscountEnabled, weeklyDiscountThreshold, weeklyDiscountPercent,
        maxDogsPerDay,
      }),
    })
    setSaving(false)
    if (res.ok) setSuccess(true)
    else setError('Erreur lors de la mise à jour.')
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

  // Tous les bookings du mois sauf annulés — calculés ensemble pour que la remise hebdo s'applique correctement
  const allMonthBookings = bookings.filter(b => b.status !== 'cancelled' && inCurrentMonth(b))
  const allMonthCosts = computeBookingCosts(allMonthBookings, billingConfig)

  const completedRevenue = allMonthCosts
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.finalCost, 0)
  const upcomingRevenue = allMonthCosts
    .filter(b => b.status !== 'completed')
    .reduce((sum, b) => sum + b.finalCost, 0)
  const totalRevenue = completedRevenue + upcomingRevenue

  const completedCount = allMonthCosts.filter(b => b.status === 'completed').length
  const upcomingCount = allMonthCosts.filter(b => b.status !== 'completed').length
  const hasPrice = pricePerUnit > 0 || priceHalfDay > 0

  const userMap = new Map(users.map(u => [u['@id'], u]))

  const c = 'p_Admin'

  if (meLoading) return <div className={`${c} ${c}-loading`}>Chargement...</div>
  if (!me) return null

  const SECTIONS = [
    { key: 'bookings' as Section, label: 'Réservations', badge: pendingCount > 0 ? pendingCount : null },
    { key: 'users'    as Section, label: 'Utilisateurs', badge: null },
    { key: 'dogs'     as Section, label: 'Chiens',       badge: null },
    { key: 'schedule' as Section, label: 'Horaires',     badge: null },
  ]

  return (
    <div className={c}>
      <div className={`${c}_header`}>
        <h1 className={`${c}_title`}>Administration</h1>
        <p className={`${c}_daycare`}>{me.daycare.name}</p>
      </div>

      {/* ── Navigation sections ── */}
      <nav className={`${c}_nav`}>
        {SECTIONS.map(s => (
          <button
            key={s.key}
            className={`${c}_navBtn${activeSection === s.key ? ` ${c}_navBtn-active` : ''}`}
            onClick={() => setActiveSection(s.key)}
          >
            {s.label}
            {s.badge !== null && <span className={`${c}_badge`}>{s.badge}</span>}
          </button>
        ))}
      </nav>

      {/* ── Réservations ── */}
      {activeSection === 'bookings' && (
        <section className={`${c}_section`}>
          {hasPrice && (
            <div className={`${c}_revenue`}>
              <div className={`${c}_revenueTotal`}>{formatCost(totalRevenue)}</div>
              <div className={`${c}_revenueLabel`}>
                Total du mois · {BILLING_MODE_LABELS[billingMode]}
                {weeklyDiscountEnabled && ` · remise −${weeklyDiscountPercent}% dès ${weeklyDiscountThreshold} rés./semaine`}
              </div>
              <div className={`${c}_revenueBreakdown`}>
                <div className={`${c}_revenueItem`}>
                  <span className={`${c}_revenueItemLabel`}>Réalisé</span>
                  <span className={`${c}_revenueItemAmount ${c}_revenueItemAmount-done`}>{formatCost(completedRevenue)}</span>
                  <span className={`${c}_revenueItemCount`}>{completedCount} terminée{completedCount > 1 ? 's' : ''}</span>
                </div>
                <div className={`${c}_revenueSep`} />
                <div className={`${c}_revenueItem`}>
                  <span className={`${c}_revenueItemLabel`}>À venir</span>
                  <span className={`${c}_revenueItemAmount ${c}_revenueItemAmount-upcoming`}>{formatCost(upcomingRevenue)}</span>
                  <span className={`${c}_revenueItemCount`}>{upcomingCount} réservation{upcomingCount > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Navigation semaine ── */}
          <div className={`${c}_weekNav`}>
            <button className={`${c}_weekBtn`} onClick={() => setWeekOffset(o => o - 1)}>
              <i className='bi bi-chevron-left' />
            </button>
            <div className={`${c}_weekLabel`}>
              <span>{week.label}</span>
              {weekOffset !== 0 && (
                <button className={`${c}_weekToday`} onClick={() => setWeekOffset(0)}>
                  Aujourd'hui
                </button>
              )}
            </div>
            <button className={`${c}_weekBtn`} onClick={() => setWeekOffset(o => o + 1)}>
              <i className='bi bi-chevron-right' />
            </button>
          </div>

          {/* ── Onglets statut ── */}
          <div className={`${c}_tabs`}>
            {STATUS_TABS.map(tab => (
              <button
                key={tab.key}
                className={`${c}_tab${filter === tab.key ? ` ${c}_tab-active` : ''}`}
                onClick={() => setFilter(tab.key)}
              >
                {tab.label}
                {tab.key === 'pending' && pendingThisWeek > 0 && ` (${pendingThisWeek})`}
              </button>
            ))}
          </div>

          {bookingsLoading ? (
            <p className={`${c}_empty`}>Chargement...</p>
          ) : filtered.length === 0 ? (
            <p className={`${c}_empty`}>Aucune réservation cette semaine.</p>
          ) : (
            <div className={`${c}_bookings`}>
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
        <section className={`${c}_section`}>
          {usersLoading ? (
            <p className={`${c}_empty`}>Chargement...</p>
          ) : users.length === 0 ? (
            <p className={`${c}_empty`}>Aucun utilisateur.</p>
          ) : (
            <div className={`${c}_list`}>
              {users.map(u => (
                <UserCard
                  key={u['@id']}
                  user={u}
                  dogCount={dogs.filter(d => d.owner === u['@id']).length}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Chiens ── */}
      {activeSection === 'dogs' && (
        <section className={`${c}_section`}>
          {usersLoading ? (
            <p className={`${c}_empty`}>Chargement...</p>
          ) : dogs.length === 0 ? (
            <p className={`${c}_empty`}>Aucun chien.</p>
          ) : (
            <div className={`${c}_list`}>
              {dogs.map(d => {
                const owner = userMap.get(d.owner)
                const ownerName = owner ? [owner.firstName, owner.lastName].filter(Boolean).join(' ') || owner.email : '—'
                const ownerEmail = owner?.email ?? '—'
                return (
                  <DogCard key={d['@id']} dog={d} ownerName={ownerName} ownerEmail={ownerEmail} />
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* ── Horaires ── */}
      {activeSection === 'schedule' && (
        <section className={`${c}_section`}>
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
            {/* ── Mode de facturation ── */}
            <div className={`${c}_field`}>
              <label className={`${c}_label`}>Mode de facturation</label>
              <select className={`${c}_select`} value={billingMode} onChange={e => setBillingMode(e.target.value as BillingMode)}>
                {(Object.entries(BILLING_MODE_LABELS) as [BillingMode, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            {billingMode === 'hourly' ? (
              <>
                <div className={`${c}_field`}>
                  <label className={`${c}_label`}>Tarif de base</label>
                  <div className={`${c}_inputRow`}>
                    <input className={`${c}_select`} type='number' min='0' step='0.5' value={pricePerUnit}
                      onChange={e => setPricePerUnit(parseFloat(e.target.value) || 0)} />
                    <span className={`${c}_inputUnit`}>€ / heure</span>
                  </div>
                </div>
                <label className={`${c}_toggle`}>
                  <input type='checkbox' checked={tierEnabled} onChange={e => setTierEnabled(e.target.checked)} />
                  <span>Tarif dégressif au-delà d'un certain nombre d'heures</span>
                </label>
                {tierEnabled && (
                  <div className={`${c}_tier`}>
                    <span className={`${c}_tierLabel`}>Au-delà de</span>
                    <input className={`${c}_tierInput`} type='number' min='1' step='0.5' value={tierHoursThreshold}
                      onChange={e => setTierHoursThreshold(parseFloat(e.target.value) || 1)} />
                    <span className={`${c}_tierLabel`}>h →</span>
                    <input className={`${c}_tierInput`} type='number' min='0' step='0.5' value={tierPrice}
                      onChange={e => setTierPrice(parseFloat(e.target.value) || 0)} />
                    <span className={`${c}_tierLabel`}>€ / heure</span>
                  </div>
                )}
              </>
            ) : (
              <div className={`${c}_times`}>
                <div className={`${c}_field`}>
                  <label className={`${c}_label`}>Demi-journée {'<'} 4h</label>
                  <div className={`${c}_inputRow`}>
                    <input className={`${c}_select`} type='number' min='0' step='0.5' value={priceHalfDay}
                      onChange={e => setPriceHalfDay(parseFloat(e.target.value) || 0)} />
                    <span className={`${c}_inputUnit`}>€</span>
                  </div>
                </div>
                <div className={`${c}_field`}>
                  <label className={`${c}_label`}>Journée complète ≥ 4h</label>
                  <div className={`${c}_inputRow`}>
                    <input className={`${c}_select`} type='number' min='0' step='0.5' value={pricePerUnit}
                      onChange={e => setPricePerUnit(parseFloat(e.target.value) || 0)} />
                    <span className={`${c}_inputUnit`}>€</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Remise hebdomadaire ── */}
            <div className={`${c}_divider`} />
            <label className={`${c}_toggle`}>
              <input type='checkbox' checked={weeklyDiscountEnabled}
                onChange={e => setWeeklyDiscountEnabled(e.target.checked)} />
              <span>Remise hebdomadaire</span>
            </label>
            {weeklyDiscountEnabled && (
              <div className={`${c}_tier`}>
                <span className={`${c}_tierLabel`}>À partir de</span>
                <input className={`${c}_tierInput`} type='number' min='2' step='1' value={weeklyDiscountThreshold}
                  onChange={e => setWeeklyDiscountThreshold(parseInt(e.target.value) || 2)} />
                <span className={`${c}_tierLabel`}>réservations/semaine →</span>
                <input className={`${c}_tierInput`} type='number' min='0' max='100' step='1' value={weeklyDiscountPercent}
                  onChange={e => setWeeklyDiscountPercent(parseFloat(e.target.value) || 0)} />
                <span className={`${c}_tierLabel`}>% de remise</span>
              </div>
            )}

            {/* ── Capacité ── */}
            <div className={`${c}_divider`} />
            <div className={`${c}_field`}>
              <label className={`${c}_label`}>Capacité maximale par jour</label>
              <div className={`${c}_inputRow`}>
                <input
                  className={`${c}_select`}
                  type='number'
                  min='1'
                  step='1'
                  placeholder='Illimitée'
                  value={maxDogsPerDay ?? ''}
                  onChange={e => setMaxDogsPerDay(e.target.value === '' ? null : parseInt(e.target.value))}
                />
                <span className={`${c}_inputUnit`}>chiens / jour</span>
              </div>
              <span className={`${c}_fieldHint`}>Laisser vide pour aucune limite</span>
            </div>

            {success && <p className={`${c}_success`}>Paramètres mis à jour.</p>}
            {error && <p className={`${c}_error`}>{error}</p>}
            <Button label={saving ? 'Enregistrement...' : 'Enregistrer'} type='submit' color={ColorButton.PRIMARY} />
          </form>
        </section>
      )}
    </div>
  )
}
