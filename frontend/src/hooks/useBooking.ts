'use client'

import { useEffect, useState } from 'react'
import { generateTimeSlots } from '@/utils/timeSlots'
import { AvailableDate, generateAvailableDates } from '@/utils/availableDates'

type Dog = {
  '@id': string
  name: string
  breed: string | null
}

type DaycareConfig = {
  id: number
  openingTime: string
  closingTime: string
  openDays: number[]
  maxDogsPerDay: number | null
}

export type OccupancyInfo = {
  count: number
  max: number | null
  isFull: boolean
  dogs: { name: string; breed: string | null }[]
}

type UseBookingReturn = {
  dogs: Dog[]
  config: DaycareConfig
  timeSlots: string[]
  availableDates: AvailableDate[]
  occupancy: OccupancyInfo | null
  occupancyLoading: boolean
  loading: boolean
  error: string | null
  fetchOccupancy: (date: string) => Promise<void>
  submit: (dogIri: string, date: string, startTime: string, endTime: string) => Promise<boolean>
}

export function useBooking(): UseBookingReturn {
  const [dogs, setDogs] = useState<Dog[]>([])
  const [config, setConfig] = useState<DaycareConfig>({
    id: 0,
    openingTime: '08:00',
    closingTime: '19:00',
    openDays: [1, 2, 3, 4, 5],
    maxDogsPerDay: null,
  })
  const [occupancy, setOccupancy] = useState<OccupancyInfo | null>(null)
  const [occupancyLoading, setOccupancyLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    const api = process.env.NEXT_PUBLIC_API_URL
    const headers = { Authorization: `Bearer ${token}`, Accept: 'application/ld+json' }

    fetch(`${api}/auth/me`, { headers })
      .then(r => r.json())
      .then(me => {
        setConfig({
          id: me.daycare.id,
          openingTime: me.daycare.openingTime,
          closingTime: me.daycare.closingTime,
          openDays: me.daycare.openDays ?? [1, 2, 3, 4, 5],
          maxDogsPerDay: me.daycare.maxDogsPerDay ?? null,
        })
        return fetch(`${api}/api/dogs?owner=${me.id}`, { headers })
      })
      .then(r => r.json())
      .then(data => setDogs(data['member'] ?? data['hydra:member'] ?? []))
      .catch(() => setError('Impossible de charger vos données.'))
      .finally(() => setLoading(false))
  }, [])

  const fetchOccupancy = async (date: string) => {
    if (!date || !config.id) return
    setOccupancyLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/daycares/${config.id}/occupancy?date=${date}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.ok) setOccupancy(await res.json())
    } catch {
      // occupancy is non-blocking
    } finally {
      setOccupancyLoading(false)
    }
  }

  const timeSlots = generateTimeSlots(config.openingTime, config.closingTime)
  const availableDates = generateAvailableDates(config.openDays)

  const submit = async (dogIri: string, date: string, startTime: string, endTime: string): Promise<boolean> => {
    setError(null)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/ld+json',
          Accept: 'application/ld+json',
        },
        body: JSON.stringify({
          dog: dogIri,
          startDate: `${date}T${startTime}:00`,
          endDate: `${date}T${endTime}:00`,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.detail ?? 'Erreur lors de la réservation.')
        return false
      }
      return true
    } catch {
      setError('Impossible de contacter le serveur.')
      return false
    }
  }

  return { dogs, config, timeSlots, availableDates, occupancy, occupancyLoading, loading, error, submit, fetchOccupancy }
}
