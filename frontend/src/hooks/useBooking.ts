'use client'

import { useEffect, useState } from 'react'

type Dog = {
  '@id': string
  name: string
  breed: string | null
}

type DaycareConfig = {
  openingTime: string
  closingTime: string
  openDays: number[]
}

export type AvailableDate = {
  value: string
  label: string
}

type UseBookingReturn = {
  dogs: Dog[]
  config: DaycareConfig
  timeSlots: string[]
  availableDates: AvailableDate[]
  loading: boolean
  error: string | null
  submit: (dogIri: string, date: string, startTime: string, endTime: string) => Promise<boolean>
}

function generateTimeSlots(opening: string, closing: string): string[] {
  const [openH, openM] = opening.split(':').map(Number)
  const [closeH, closeM] = closing.split(':').map(Number)
  const slots: string[] = []
  let totalMin = openH * 60 + openM
  const closeMin = closeH * 60 + closeM
  while (totalMin <= closeMin) {
    const h = Math.floor(totalMin / 60)
    const m = totalMin % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    totalMin += 30
  }
  return slots
}

const DAY_LABELS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
const MONTH_LABELS = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'aoû', 'sep', 'oct', 'nov', 'déc']

function generateAvailableDates(openDays: number[], count = 30): AvailableDate[] {
  const dates: AvailableDate[] = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  let checked = 0
  while (dates.length < count && checked < 365) {
    if (openDays.includes(cursor.getDay())) {
      const y = cursor.getFullYear()
      const m = String(cursor.getMonth() + 1).padStart(2, '0')
      const d = String(cursor.getDate()).padStart(2, '0')
      const label = `${DAY_LABELS[cursor.getDay()]} ${cursor.getDate()} ${MONTH_LABELS[cursor.getMonth()]}`
      dates.push({ value: `${y}-${m}-${d}`, label })
    }
    cursor.setDate(cursor.getDate() + 1)
    checked++
  }
  return dates
}

export function useBooking(): UseBookingReturn {
  const [dogs, setDogs] = useState<Dog[]>([])
  const [config, setConfig] = useState<DaycareConfig>({ openingTime: '08:00', closingTime: '19:00', openDays: [1, 2, 3, 4, 5] })
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
          openingTime: me.daycare.openingTime,
          closingTime: me.daycare.closingTime,
          openDays: me.daycare.openDays ?? [1, 2, 3, 4, 5],
        })
        return fetch(`${api}/api/dogs?owner=${me.id}`, { headers })
      })
      .then(r => r.json())
      .then(data => setDogs(data['member'] ?? data['hydra:member'] ?? []))
      .catch(() => setError('Impossible de charger vos données.'))
      .finally(() => setLoading(false))
  }, [])

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

  return { dogs, config, timeSlots, availableDates, loading, error, submit }
}
