'use client'

import { useState, FormEvent } from 'react'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'
import { Booking } from '@/hooks/useMe'
import { authHeaders } from '@/utils/authHeaders'
import { generateTimeSlots } from '@/utils/timeSlots'
import { generateAvailableDates, withGuaranteedDate } from '@/utils/availableDates'

const API = process.env.NEXT_PUBLIC_API_URL

const STATUS_LABELS: Record<string, string> = {
   pending: 'En attente',
   confirmed: 'Confirmée',
   cancelled: 'Annulée',
   completed: 'Terminée',
}

const componentsClass = 'o_BookingSection'
const parentClass = 'o_MeSection'

function isCancellable(booking: Booking): boolean {
   return (booking.status === 'pending' || booking.status === 'confirmed')
      && new Date(booking.startDate) > new Date(Date.now() + 86_400_000)
}

function BookingRow({ booking, refetch, openingTime, closingTime, openDays }: { booking: Booking; refetch: () => void; openingTime: string; closingTime: string; openDays: number[] }) {
   const isPending = booking.status === 'pending'
   const canCancel = isCancellable(booking)
   const [date, setDate] = useState(booking.startDate.slice(0, 10))
   const [startTime, setStartTime] = useState(booking.startDate.slice(11, 16))
   const [endTime, setEndTime] = useState(booking.endDate.slice(11, 16))
   const [open, setOpen] = useState(false)
   const [success, setSuccess] = useState(false)
   const [error, setError] = useState<string | null>(null)
   const [cancelling, setCancelling] = useState(false)

   const timeSlots = generateTimeSlots(openingTime, closingTime)
   const endTimeSlots = timeSlots.filter(t => t > startTime)
   const availableDates = withGuaranteedDate(generateAvailableDates(openDays), date)

   const handleStartTimeChange = (val: string) => {
      setStartTime(val)
      if (val >= endTime) {
         const idx = timeSlots.indexOf(val)
         if (idx >= 0 && timeSlots[idx + 1]) setEndTime(timeSlots[idx + 1])
      }
   }

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault()
      setError(null)
      setSuccess(false)
      const res = await fetch(`${API}${booking['@id']}`, {
         method: 'PATCH',
         headers: authHeaders(),
         body: JSON.stringify({
            startDate: `${date}T${startTime}:00`,
            endDate: `${date}T${endTime}:00`,
         }),
      })
      if (res.ok) {
         setSuccess(true)
         refetch()
         setTimeout(() => setOpen(false), 800)
      } else {
         const data = await res.json().catch(() => null)
         setError(data?.detail ?? 'Erreur lors de la modification de la réservation.')
      }
   }

   const handleCancel = async () => {
      if (!confirm("Confirmer l'annulation de cette réservation ?")) return
      setCancelling(true)
      await fetch(`${API}${booking['@id']}`, {
         method: 'PATCH',
         headers: authHeaders(),
         body: JSON.stringify({
            status: 'cancelled'
         }),
      })
      setCancelling(false)
      refetch()
   }

   return (
      <div className={`${componentsClass} ${componentsClass}-${booking.status}`}>
         <div className={`${componentsClass}-header`} onClick={() => isPending && setOpen(o => !o)}>
            <span className={`${componentsClass}-dog`}>{booking.dog.name}</span>
            <span className={`${componentsClass}-dates`}>
               {new Date(booking.startDate.slice(0, 19)).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}{' '}
               {booking.startDate.slice(11, 16)}
               {' → '}
               {booking.endDate.slice(11, 16)}
            </span>
            <span className={`${componentsClass}-status`}>{STATUS_LABELS[booking.status] ?? booking.status}</span>
            <div className={`${componentsClass}-actions`}>
               {canCancel && (
                  <button
                     className={`${componentsClass}-cancel`}
                     onClick={e => { e.stopPropagation(); handleCancel() }}
                     disabled={cancelling}
                  >
                     {cancelling ? '...' : 'Annuler'}
                  </button>
               )}
               {isPending && <i className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'}`} />}
            </div>
         </div>
         {isPending && open && (
            <form className={`${componentsClass}-form`} onSubmit={handleSubmit}>
               <div className={`${componentsClass}-times`}>
                  <div className={`${componentsClass}-field`}>
                     <label className={`${componentsClass}-label`}>Date</label>
                     <select className={`${componentsClass}-select`} value={date} onChange={e => setDate(e.target.value)} required>
                        {availableDates.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                     </select>
                  </div>
                  <div className={`${componentsClass}-field`}>
                     <label className={`${componentsClass}-label`}>Heure de début</label>
                     <select className={`${componentsClass}-select`} value={startTime} onChange={e => handleStartTimeChange(e.target.value)} required>
                        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                  </div>
                  <div className={`${componentsClass}-field`}>
                     <label className={`${componentsClass}-label`}>Heure de fin</label>
                     <select className={`${componentsClass}-select`} value={endTime} onChange={e => setEndTime(e.target.value)} required>
                        {endTimeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                  </div>
               </div>
               {success && <p className={`${componentsClass}-success`}>Réservation mise à jour.</p>}
               {error && <p className={`${componentsClass}-error`}>{error}</p>}
               <Button
                  label='Enregistrer'
                  type='submit'
                  color={ColorButton.PRIMARY}
                  className={`${componentsClass}-submit`}
               />
            </form>
         )}
      </div>
   )
}

type Props = {
   bookings: Booking[]
   refetch: () => void
   monthLabel: string
   openingTime: string
   closingTime: string
   openDays: number[]
}

const BookingsSection = ({ bookings, refetch, monthLabel, openingTime, closingTime, openDays }: Props) => {
   return (
      <section className={parentClass}>
         <h2 className={`${parentClass}-title`}>Mes réservations — {monthLabel}</h2>
         {bookings.length === 0
            ? <p className={`${parentClass}-empty`}>Aucune réservation ce mois-ci.</p>
            : bookings.map(b => (
               <BookingRow key={b['@id']} booking={b} refetch={refetch} openingTime={openingTime} closingTime={closingTime} openDays={openDays} />
            ))
         }
      </section>
   )
}

export default BookingsSection