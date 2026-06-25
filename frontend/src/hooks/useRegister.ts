'use client'

import { useEffect, useState } from 'react'

type RegisterPayload = {
  email: string
  password: string
  daycareId: number
}

type Daycare = {
  id: number
  name: string
}

type UseRegisterReturn = {
  register: (payload: RegisterPayload) => Promise<boolean>
  daycares: Daycare[]
  loading: boolean
  error: string | null
}

export function useRegister(): UseRegisterReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [daycares, setDaycares] = useState<Daycare[]>([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/daycares`, {
      headers: { Accept: 'application/ld+json' },
    })
      .then((res) => res.json())
      .then((data) => {
        const members = data['hydra:member'] ?? data['member'] ?? []
        setDaycares(members.map((d: any) => ({ id: d.id, name: d.name })))
      })
      .catch(() => {})
  }, [])

  const register = async (payload: RegisterPayload): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
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
