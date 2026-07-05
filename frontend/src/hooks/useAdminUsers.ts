'use client'

import { useEffect, useState } from 'react'

export type AdminUser = {
  '@id': string
  id: number
  email: string
  firstName: string | null
  lastName: string | null
  roles: string[]
  daycare: { id: number; name: string }
}

export type AdminDog = {
  '@id': string
  id: number
  name: string
  breed: string | null
  birthDate: string | null
  owner: string
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [dogs, setDogs] = useState<AdminDog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}`, Accept: 'application/ld+json' } as HeadersInit
    const api = process.env.NEXT_PUBLIC_API_URL

    Promise.all([
      fetch(`${api}/api/users`, { headers }).then(r => r.json()),
      fetch(`${api}/api/dogs`, { headers }).then(r => r.json()),
    ]).then(([usersData, dogsData]) => {
      setUsers(usersData['member'] ?? usersData['hydra:member'] ?? [])
      setDogs(dogsData['member'] ?? dogsData['hydra:member'] ?? [])
    }).finally(() => setLoading(false))
  }, [])

  return { users, dogs, loading }
}
