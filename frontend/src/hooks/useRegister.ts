'use client'

import { useEffect, useState } from 'react'

type RegisterPayload = {
  email: string
  password: string
  firstName: string
  lastName: string
  daycareId: number
}

export type DaycareOption = {
  id: number
  name: string
}

type UseRegisterReturn = {
  register: (payload: RegisterPayload) => Promise<boolean>
  daycares: DaycareOption[]
  loading: boolean
  error: string | null
}

export function useRegister(): UseRegisterReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [daycares, setDaycares] = useState<DaycareOption[]>([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/daycares`, {
      headers: { Accept: 'application/ld+json' },
    })
      .then(res => res.json())
      .then(data => {
        const members = data['hydra:member'] ?? data['member'] ?? []
        setDaycares(members.map((d: { '@id': string; id?: number; name: string }) => ({
          id: d.id ?? parseInt((d['@id'] ?? '').split('/').pop() ?? '0', 10),
          name: d.name,
        })))
      })
      .catch(() => {})
  }, [])

  const register = async (payload: RegisterPayload): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? "Une erreur est survenue lors de l'inscription.")
        return false
      }
      return true
    } catch {
      setError('Impossible de contacter le serveur.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { register, daycares, loading, error }
}
