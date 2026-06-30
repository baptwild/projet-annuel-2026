'use client'

import { useEffect, useState, useCallback } from 'react'

export type Dog = {
  '@id': string
  name: string
  breed: string | null
  birthDate: string | null
}

export type Booking = {
  '@id': string
  id: number
  startDate: string
  endDate: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  dog: { '@id': string; name: string }
}

export type Me = {
  id: number
  email: string
  firstName: string | null
  lastName: string | null
  roles: string[]
  daycare: {
    id: number
    name: string
    slug: string
    openingTime: string; closingTime: string; openDays: number[]
    billingMode: string; pricePerUnit: number; priceHalfDay: number
    tierHoursThreshold: number | null; tierPrice: number | null
    weeklyDiscountEnabled: boolean; weeklyDiscountThreshold: number; weeklyDiscountPercent: number
    maxDogsPerDay: number | null
  }
}

type UseMeReturn = {
  me: Me | null
  dogs: Dog[]
  bookings: Booking[]
  loading: boolean
  refetch: () => void
}

export function useMe(): UseMeReturn {
  const [me, setMe] = useState<Me | null>(null)
  const [dogs, setDogs] = useState<Dog[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/ld+json',
    }
    const api = process.env.NEXT_PUBLIC_API_URL

    try {
      const meRes = await fetch(`${api}/auth/me`, { headers })
      if (!meRes.ok) { setLoading(false); return }
      const meData: Me = await meRes.json()
      setMe(meData)

      const [dogsRes, bookingsRes] = await Promise.all([
        fetch(`${api}/api/dogs?owner=${meData.id}`, { headers }),
        fetch(`${api}/api/bookings?dog.owner=${meData.id}`, { headers }),
      ])

      const dogsData = await dogsRes.json()
      const bookingsData = await bookingsRes.json()

      setDogs(dogsData['member'] ?? dogsData['hydra:member'] ?? [])
      setBookings(bookingsData['member'] ?? bookingsData['hydra:member'] ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  return { me, dogs, bookings, loading, refetch: fetchAll }
}
