'use client'

import { useState, FormEvent } from 'react'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'
import { Booking } from '@/hooks/useMe'
import { authHeaders } from '@/utils/authHeaders'

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
      if (res.ok) {
         setSuccess(true)
         refetch()
         setTimeout(() => setOpen(false), 800)
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
               {new Date(booking.startDate).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}{' '}
               {new Date(booking.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
               {' → '}
               {new Date(booking.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
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
               <div className={`${parentClass}-row`}>
                  <label>Date de début</label>
                  <input type='date' value={startDate} onChange={e => setStartDate(e.target.value)} required />
               </div>
               <div className={`${parentClass}-row`}>
                  <label>Date de fin</label>
                  <input type='date' value={endDate} onChange={e => setEndDate(e.target.value)} required />
               </div>
               {success && <p className={`${parentClass}-success`}>Réservation mise à jour.</p>}
               <Button
                  label='Enregistrer'
                  type='submit'
                  color={ColorButton.PRIMARY}
                  className={`${parentClass}-submit`}
               />
            </form>
         )}
      </div>
   )
}

type Props = {
   bookings: Booking[]
   refetch: () => void
}

const BookingsSection = ({ bookings, refetch }: Props) => {
   return (
      <section className={parentClass}>
         <h2 className={`${parentClass}-title`}>Mes réservations</h2>
         {bookings.length === 0
            ? <p className={`${parentClass}-empty`}>Aucune réservation.</p>
            : bookings.map(b => <BookingRow key={b['@id']} booking={b} refetch={refetch} />)
         }
      </section>
   )
}

export default BookingsSection