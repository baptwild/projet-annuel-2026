'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBooking } from '@/hooks/useBooking'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'

export default function BookingPage() {
  const router = useRouter()
  const { dogs, timeSlots, availableDates, config, loading, error, submit } = useBooking()

  const [dogIri, setDogIri] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('token')) router.push('/login')
  }, [router])

  useEffect(() => {
    if (dogs.length > 0 && !dogIri) setDogIri(dogs[0]['@id'])
  }, [dogs, dogIri])

  useEffect(() => {
    if (availableDates.length > 0 && !date) setDate(availableDates[0].value)
  }, [availableDates, date])

  useEffect(() => {
    if (timeSlots.length > 0 && !startTime) setStartTime(timeSlots[0])
  }, [timeSlots, startTime])

  useEffect(() => {
    if (timeSlots.length > 1 && !endTime) setEndTime(timeSlots[1])
  }, [timeSlots, endTime])

  const handleStartChange = (val: string) => {
    setStartTime(val)
    const idx = timeSlots.indexOf(val)
    if (idx >= 0 && timeSlots[idx + 1]) setEndTime(timeSlots[idx + 1])
  }

  const endSlots = timeSlots.filter(t => t > startTime)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const ok = await submit(dogIri, date, startTime, endTime)
    setSubmitting(false)
    if (ok) setSuccess(true)
  }

  const c = 'p_Booking'

  if (loading) return <div className={`${c} ${c}-loading`}>Chargement...</div>

  if (success) {
    return (
      <div className={c}>
        <div className={`${c}_success`}>
          <i className='bi bi-check-circle' />
          <h2>Réservation envoyée !</h2>
          <p>Votre demande est en attente de confirmation par la garderie.</p>
          <div className={`${c}_success-actions`}>
            <Button label='Voir mes réservations' color={ColorButton.PRIMARY} onClick={() => router.push('/me')} />
            <Button label='Nouvelle réservation' color={ColorButton.SECONDARY} onClick={() => { setSuccess(false); setDate('') }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={c}>
      <div className={`${c}_header`}>
        <h1 className={`${c}_title`}>Nouvelle réservation</h1>
        <p className={`${c}_subtitle`}>
          Garderie ouverte de {config.openingTime} à {config.closingTime}
        </p>
      </div>

      {dogs.length === 0 ? (
        <div className={`${c}_empty`}>
          <i className='bi bi-exclamation-circle' />
          <p>Vous n'avez pas encore de chien enregistré.</p>
          <Button label='Ajouter un chien' color={ColorButton.PRIMARY} onClick={() => router.push('/me')} />
        </div>
      ) : (
        <form className={`${c}_form`} onSubmit={handleSubmit}>
          <div className={`${c}_field`}>
            <label className={`${c}_label`}>Chien</label>
            <select
              className={`${c}_select`}
              value={dogIri}
              onChange={e => setDogIri(e.target.value)}
              required
            >
              {dogs.map(dog => (
                <option key={dog['@id']} value={dog['@id']}>
                  {dog.name}{dog.breed ? ` — ${dog.breed}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className={`${c}_field`}>
            <label className={`${c}_label`}>Date</label>
            <select
              className={`${c}_select`}
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            >
              {availableDates.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          <div className={`${c}_times`}>
            <div className={`${c}_field`}>
              <label className={`${c}_label`}>Heure d'arrivée</label>
              <select
                className={`${c}_select`}
                value={startTime}
                onChange={e => handleStartChange(e.target.value)}
                required
              >
                {timeSlots.slice(0, -1).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className={`${c}_field`}>
              <label className={`${c}_label`}>Heure de départ</label>
              <select
                className={`${c}_select`}
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                required
              >
                {endSlots.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className={`${c}_error`}>{error}</p>}

          <div className={`${c}_actions`}>
            <Button
              label={submitting ? 'Envoi...' : 'Réserver'}
              type='submit'
              color={ColorButton.PRIMARY}
            />
            <Button
              label='Mes réservations'
              color={ColorButton.SECONDARY}
              onClick={() => router.push('/me')}
            />
          </div>
        </form>
      )}
    </div>
  )
}
