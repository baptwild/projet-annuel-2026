'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useBooking } from '@/hooks/useBooking'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'

export default function BookingPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const { dogs, timeSlots, availableDates, config, occupancy, occupancyLoading, loading, error, submit, fetchOccupancy } = useBooking()

  const [dogIri, setDogIri] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push(`/${slug}/login`)
    }
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

  useEffect(() => {
    if (date && config.id) fetchOccupancy(date)
  }, [date, config.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateChange = (val: string) => {
    setDate(val)
  }

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

  const componentsClass = 'p_Booking'

  if (loading) return <div className={`${componentsClass} ${componentsClass}-loading`}>Chargement...</div>

  if (success) {
    return (
      <div className={componentsClass}>
        <div className={`${componentsClass}_success`}>
          <i className='bi bi-check-circle' />
          <h2>Réservation envoyée !</h2>
          <p>Votre demande est en attente de confirmation par la garderie.</p>
          <div className={`${componentsClass}_success-actions`}>
            <Button
              label='Voir mes réservations'
              color={ColorButton.PRIMARY}
              onClick={() => router.push('/me')}
            />
            <Button
              label='Nouvelle réservation'
              color={ColorButton.SECONDARY}
              onClick={() => { setSuccess(false); setDate('') }}
            />
          </div>
        </div>
      </div>
    )
  }

  const isFull = occupancy?.isFull ?? false
  const hasMax = config.maxDogsPerDay !== null

  return (
    <div className={componentsClass}>
      <div className={`${componentsClass}_header`}>
        <h1 className={`${componentsClass}_title`}>Nouvelle réservation</h1>
        <p className={`${componentsClass}_subtitle`}>
          Garderie ouverte de {config.openingTime} à {config.closingTime}
        </p>
      </div>

      {dogs.length === 0 ? (
        <div className={`${componentsClass}_empty`}>
          <i className='bi bi-exclamation-circle' />
          <p>Vous n'avez pas encore de chien enregistré.</p>
          <Button
            label='Ajouter un chien'
            color={ColorButton.PRIMARY}
            onClick={() => router.push(`/${slug}/me`)}
          />
        </div>
      ) : (
        <form className={`${componentsClass}_form`} onSubmit={handleSubmit}>
          <div className={`${componentsClass}_field`}>
            <label className={`${componentsClass}_label`}>Chien</label>
            <select
              className={`${componentsClass}_select`}
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

          <div className={`${componentsClass}_field`}>
            <label className={`${componentsClass}_label`}>Date</label>
            <select
              className={`${componentsClass}_select`}
              value={date}
              onChange={e => handleDateChange(e.target.value)}
              required
            >
              {availableDates.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          {date && (
            <div className={`${componentsClass}_occupancy${isFull ? ` ${componentsClass}_occupancy-full` : ''}`}>
              {occupancyLoading ? (
                <span className={`${componentsClass}_occupancyLoading`}>Vérification de la disponibilité...</span>
              ) : occupancy ? (
                <>
                  <div className={`${componentsClass}_occupancyHeader`}>
                    <i className={`bi ${isFull ? 'bi-exclamation-circle' : 'bi-people'}`} />
                    <span className={`${componentsClass}_occupancyCount`}>
                      {hasMax
                        ? `${occupancy.count} / ${occupancy.max} chien${occupancy.count > 1 ? 's' : ''} ce jour`
                        : `${occupancy.count} chien${occupancy.count > 1 ? 's' : ''} inscrit${occupancy.count > 1 ? 's' : ''} ce jour`
                      }
                    </span>
                    {hasMax && (
                      <div className={`${componentsClass}_occupancyBar`}>
                        <div
                          className={`${componentsClass}_occupancyFill${isFull ? ` ${componentsClass}_occupancyFill-full` : ''}`}
                          style={{ width: `${Math.min(100, (occupancy.count / (occupancy.max ?? 1)) * 100)}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {occupancy.dogs.length > 0 && (
                    <div className={`${componentsClass}_occupancyDogs`}>
                      {occupancy.dogs.map((d, i) => (
                        <span key={i} className={`${componentsClass}_occupancyDog`}>
                          {d.name}{d.breed ? ` (${d.breed})` : ''}
                        </span>
                      ))}
                    </div>
                  )}

                  {isFull && (
                    <p className={`${componentsClass}_occupancyFullMsg`}>
                      <i className='bi bi-info-circle' /> La garderie est complète ce jour-là. Votre demande sera tout de même examinée par l'équipe.
                    </p>
                  )}
                </>
              ) : null}
            </div>
          )}

          <div className={`${componentsClass}_times`}>
            <div className={`${componentsClass}_field`}>
              <label className={`${componentsClass}_label`}>Heure d'arrivée</label>
              <select
                className={`${componentsClass}_select`}
                value={startTime}
                onChange={e => handleStartChange(e.target.value)}
                required
              >
                {timeSlots.slice(0, -1).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className={`${componentsClass}_field`}>
              <label className={`${componentsClass}_label`}>Heure de départ</label>
              <select
                className={`${componentsClass}_select`}
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

          {error && <p className={`${componentsClass}_error`}>{error}</p>}

          <div className={`${componentsClass}_actions`}>
            <Button
              label={submitting ? 'Envoi...' : 'Réserver'}
              type='submit'
              color={ColorButton.PRIMARY}
            />
            <Button
              label='Mes réservations'
              color={ColorButton.SECONDARY}
              onClick={() => router.push(`/${slug}/me`)}
            />
          </div>
        </form>
      )}
    </div>
  )
}
