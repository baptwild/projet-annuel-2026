'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMe, Dog, Booking, Me } from '@/hooks/useMe'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'
import { computeBookingCosts, formatCost, getBillingDetail, BillingConfig, BILLING_MODE_LABELS } from '@/utils/billing'

const API = process.env.NEXT_PUBLIC_API_URL

function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/merge-patch+json',
  }
}

// ── Section compte ──────────────────────────────────────────────
function AccountSection({ me, refetch }: { me: NonNullable<ReturnType<typeof useMe>['me']>; refetch: () => void }) {
  const [firstName, setFirstName] = useState(me.firstName ?? '')
  const [lastName, setLastName] = useState(me.lastName ?? '')
  const [email, setEmail] = useState(me.email)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSuccess(false); setError(null)
    const res = await fetch(`${API}/api/users/${me.id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ firstName, lastName, email }),
    })
    if (res.ok) { setSuccess(true); refetch() }
    else setError('Erreur lors de la mise à jour.')
  }

  const c = 'p_Me_section'
  return (
    <section className={c}>
      <h2 className={`${c}-title`}>Mon compte</h2>
      <form className={`${c}-form`} onSubmit={handleSubmit}>
        <div className={`${c}-row`}>
          <label>Prénom</label>
          <input value={firstName} onChange={e => setFirstName(e.target.value)} />
        </div>
        <div className={`${c}-row`}>
          <label>Nom</label>
          <input value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>
        <div className={`${c}-row`}>
          <label>Email</label>
          <input type='email' value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        {success && <p className={`${c}-success`}>Informations mises à jour.</p>}
        {error && <p className={`${c}-error`}>{error}</p>}
        <Button label='Enregistrer' type='submit' color={ColorButton.PRIMARY} />
      </form>
    </section>
  )
}

// ── Section chiens ──────────────────────────────────────────────
function DogRow({ dog, refetch }: { dog: Dog; refetch: () => void }) {
  const [name, setName] = useState(dog.name)
  const [breed, setBreed] = useState(dog.breed ?? '')
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await fetch(`${API}${dog['@id']}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ name, breed: breed || null }),
    })
    if (res.ok) { setSuccess(true); refetch(); setTimeout(() => setOpen(false), 800) }
  }

  const c = 'p_Me_dog'
  return (
    <div className={c}>
      <div className={`${c}-header`} onClick={() => setOpen(o => !o)}>
        <span className={`${c}-name`}>{dog.name}</span>
        <span className={`${c}-breed`}>{dog.breed ?? '—'}</span>
        <i className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
      </div>
      {open && (
        <form className={`${c}-form`} onSubmit={handleSubmit}>
          <div className='p_Me_section-row'>
            <label>Nom</label>
            <input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className='p_Me_section-row'>
            <label>Race</label>
            <input value={breed} onChange={e => setBreed(e.target.value)} />
          </div>
          {success && <p className='p_Me_section-success'>Enregistré.</p>}
          <Button label='Enregistrer' type='submit' color={ColorButton.PRIMARY} />
        </form>
      )}
    </div>
  )
}

function AddDogForm({ refetch }: { refetch: () => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [breed, setBreed] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const res = await fetch(`${API}/api/dogs`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/ld+json' },
      body: JSON.stringify({
        name,
        breed: breed || null,
        birthDate: birthDate ? new Date(birthDate).toISOString() : null,
      }),
    })
    if (res.ok) {
      setName(''); setBreed(''); setBirthDate('')
      setOpen(false)
      refetch()
    } else {
      setError("Erreur lors de l'ajout.")
    }
  }

  const c = 'p_Me_dog'
  return (
    <div className={`${c} ${c}-add`}>
      <div className={`${c}-header`} onClick={() => setOpen(o => !o)}>
        <i className='bi bi-plus-circle' />
        <span className={`${c}-name`}>Ajouter un chien</span>
        <i className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
      </div>
      {open && (
        <form className={`${c}-form`} onSubmit={handleSubmit}>
          <div className='p_Me_section-row'>
            <label>Nom *</label>
            <input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className='p_Me_section-row'>
            <label>Race</label>
            <input value={breed} onChange={e => setBreed(e.target.value)} />
          </div>
          <div className='p_Me_section-row'>
            <label>Date de naissance</label>
            <input type='date' value={birthDate} onChange={e => setBirthDate(e.target.value)} />
          </div>
          {error && <p className='p_Me_section-error'>{error}</p>}
          <Button label='Ajouter' type='submit' color={ColorButton.PRIMARY} />
        </form>
      )}
    </div>
  )
}

function DogsSection({ dogs, me, refetch }: { dogs: Dog[]; me: NonNullable<ReturnType<typeof useMe>['me']>; refetch: () => void }) {
  const c = 'p_Me_section'
  return (
    <section className={c}>
      <h2 className={`${c}-title`}>Mes chiens</h2>
      {dogs.length === 0 && <p className={`${c}-empty`}>Aucun chien enregistré.</p>}
      {dogs.map(dog => <DogRow key={dog['@id']} dog={dog} refetch={refetch} />)}
      <AddDogForm refetch={refetch} />
    </section>
  )
}

// ── Section réservations ────────────────────────────────────────
const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
  completed: 'Terminée',
}

function isCancellable(booking: Booking): boolean {
  return (booking.status === 'pending' || booking.status === 'confirmed')
    && new Date(booking.startDate) > new Date(Date.now() + 86_400_000)
}

function BookingRow({ booking, refetch }: { booking: Booking; refetch: () => void }) {
  const isPending = booking.status === 'pending'
  const canCancel = isCancellable(booking)
  const [startDate, setStartDate] = useState(booking.startDate.slice(0, 10))
  const [endDate, setEndDate] = useState(booking.endDate.slice(0, 10))
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await fetch(`${API}${booking['@id']}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      }),
    })
    if (res.ok) { setSuccess(true); refetch(); setTimeout(() => setOpen(false), 800) }
  }

  const handleCancel = async () => {
    if (!confirm('Confirmer l\'annulation de cette réservation ?')) return
    setCancelling(true)
    await fetch(`${API}${booking['@id']}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status: 'cancelled' }),
    })
    setCancelling(false)
    refetch()
  }

  const c = 'p_Me_booking'
  return (
    <div className={`${c} ${c}-${booking.status}`}>
      <div className={`${c}-header`} onClick={() => isPending && setOpen(o => !o)}>
        <span className={`${c}-dog`}>{booking.dog.name}</span>
        <span className={`${c}-dates`}>
          {new Date(booking.startDate).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}{' '}
          {new Date(booking.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          {' → '}
          {new Date(booking.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </span>
        <span className={`${c}-status`}>{STATUS_LABELS[booking.status] ?? booking.status}</span>
        <div className={`${c}-actions`}>
          {canCancel && (
            <button className={`${c}-cancel`} onClick={e => { e.stopPropagation(); handleCancel() }} disabled={cancelling}>
              {cancelling ? '...' : 'Annuler'}
            </button>
          )}
          {isPending && <i className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'}`} />}
        </div>
      </div>
      {isPending && open && (
        <form className={`${c}-form`} onSubmit={handleSubmit}>
          <div className='p_Me_section-row'>
            <label>Date de début</label>
            <input type='date' value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </div>
          <div className='p_Me_section-row'>
            <label>Date de fin</label>
            <input type='date' value={endDate} onChange={e => setEndDate(e.target.value)} required />
          </div>
          {success && <p className='p_Me_section-success'>Réservation mise à jour.</p>}
          <Button label='Enregistrer' type='submit' color={ColorButton.PRIMARY} />
        </form>
      )}
    </div>
  )
}

function CostSection({ bookings, me }: { bookings: Booking[]; me: Me }) {
  const d = me.daycare
  const config: BillingConfig = {
    billingMode: d.billingMode as BillingConfig['billingMode'],
    pricePerUnit: d.pricePerUnit,
    priceHalfDay: d.priceHalfDay,
    tierHoursThreshold: d.tierHoursThreshold,
    tierPrice: d.tierPrice,
    weeklyDiscountEnabled: d.weeklyDiscountEnabled,
    weeklyDiscountThreshold: d.weeklyDiscountThreshold,
    weeklyDiscountPercent: d.weeklyDiscountPercent,
  }

  if (!d.pricePerUnit && !d.priceHalfDay) return null

  const now = new Date()
  const monthBookings = bookings.filter(b => {
    if (b.status === 'cancelled') return false
    const date = new Date(b.startDate)
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
  })

  const withCosts = computeBookingCosts(monthBookings, config)
  const total = withCosts.reduce((sum, b) => sum + b.finalCost, 0)
  const totalSaving = withCosts.reduce((sum, b) => sum + b.saving, 0)
  const monthLabel = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const c = 'p_Me_section'

  return (
    <section className={c}>
      <h2 className={`${c}-title`}>
        Estimation — {monthLabel}
        <span className='p_Me_badge'>{BILLING_MODE_LABELS[config.billingMode]}</span>
      </h2>
      {withCosts.length === 0 ? (
        <p className={`${c}-empty`}>Aucune réservation ce mois-ci.</p>
      ) : (
        <>
          {d.weeklyDiscountEnabled && (
            <p className='p_Me_costDiscount'>
              <i className='bi bi-tag' /> Remise de {d.weeklyDiscountPercent}% dès {d.weeklyDiscountThreshold} réservations/semaine
            </p>
          )}
          <div className='p_Me_costList'>
            {withCosts.map(b => (
              <div key={b['@id']} className={`p_Me_costRow${b.discounted ? ' p_Me_costRow-discounted' : ''}`}>
                <span className='p_Me_costDog'>{b.dog.name}</span>
                <span className='p_Me_costDate'>
                  {new Date(b.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  {' · '}
                  {new Date(b.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  {' → '}
                  {new Date(b.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className='p_Me_costDetail'>{getBillingDetail(b.startDate, b.endDate, config)}</span>
                <span className='p_Me_costAmount'>
                  {b.discounted && <s className='p_Me_costStrike'>{formatCost(b.baseCost)}</s>}
                  {formatCost(b.finalCost)}
                </span>
              </div>
            ))}
          </div>
          <div className='p_Me_costTotal'>
            <span>
              Total estimé
              {totalSaving > 0 && <span className='p_Me_costSaving'> (économie : {formatCost(totalSaving)})</span>}
            </span>
            <span className='p_Me_costTotalAmount'>{formatCost(total)}</span>
          </div>
        </>
      )}
    </section>
  )
}

function BookingsSection({ bookings, refetch }: { bookings: Booking[]; refetch: () => void }) {
  const c = 'p_Me_section'
  return (
    <section className={c}>
      <h2 className={`${c}-title`}>Mes réservations</h2>
      {bookings.length === 0
        ? <p className={`${c}-empty`}>Aucune réservation.</p>
        : bookings.map(b => <BookingRow key={b['@id']} booking={b} refetch={refetch} />)
      }
    </section>
  )
}

// ── Page principale ─────────────────────────────────────────────
export default function MePage() {
  const router = useRouter()
  const { me, dogs, bookings, loading, refetch } = useMe()

  useEffect(() => {
    if (!loading && !me) router.push('/login')
  }, [loading, me, router])

  if (loading) return <div className='p_Me p_Me-loading'>Chargement...</div>
  if (!me) return null

  return (
    <div className='p_Me'>
      <div className='p_Me_header'>
        <h1 className='p_Me_title'>
          Bonjour, {me.firstName ?? me.email}
          {me.roles.includes('ROLE_ADMIN') && <span className='p_Me_badge'>Admin</span>}
        </h1>
        <p className='p_Me_daycare'>{me.daycare.name}</p>
      </div>

      <div className='p_Me_content'>
        <AccountSection me={me} refetch={refetch} />
        <DogsSection dogs={dogs} me={me} refetch={refetch} />
        <BookingsSection bookings={bookings} refetch={refetch} />
        <CostSection bookings={bookings} me={me} />
      </div>
    </div>
  )
}
