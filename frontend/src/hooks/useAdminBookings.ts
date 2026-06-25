'use client'

import { useCallback, useEffect, useState } from 'react'

export type AdminBooking = {
  '@id': string
  id: number
  startDate: string
  endDate: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
  dog: {
    '@id': string
    name: string
    breed: string | null
    owner: {
      email: string
      firstName: string | null
      lastName: string | null
    }
  }
}

type UseAdminBookingsReturn = {
  bookings: AdminBooking[]
  loading: boolean
  updateStatus: (iri: string, status: 'confirmed' | 'cancelled') => Promise<void>
}

export function useAdminBookings(): UseAdminBookingsReturn {
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = useCallback(async () => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/ld+json' },
    })
    const data = await res.json()
    setBookings(data['member'] ?? data['hydra:member'] ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const updateStatus = async (iri: string, status: 'confirmed' | 'cancelled') => {
    const token = localStorage.getItem('token')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}${iri}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/merge-patch+json',
      },
      body: JSON.stringify({ status }),
    })
    await fetchBookings()
  }

  return { bookings, loading, updateStatus }
}
