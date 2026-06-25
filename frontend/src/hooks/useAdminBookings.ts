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
  updateStatus: (iri: string, status: 'confirmed' | 'cancelled' | 'completed') => Promise<void>
}

export function useAdminBookings(): UseAdminBookingsReturn {
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = useCallback(async () => {
    const token = localStorage.getItem('token')
    const API = process.env.NEXT_PUBLIC_API_URL
    const all: AdminBooking[] = []
    let url: string | null = `${API}/api/bookings?itemsPerPage=100&page=1`

    while (url) {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/ld+json' },
      })
      const data = await res.json()
      const members: AdminBooking[] = data['member'] ?? data['hydra:member'] ?? []
      all.push(...members)
      const next = data['view']?.['next'] ?? data['hydra:view']?.['hydra:next'] ?? null
      url = next ? `${API}${next}` : null
    }

    setBookings(all)
    setLoading(false)
  }, [])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const updateStatus = async (iri: string, status: 'confirmed' | 'cancelled' | 'completed') => {
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
