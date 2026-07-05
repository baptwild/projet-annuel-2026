'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

type LoginPayload = {
  email: string
  password: string
}

type UseLoginReturn = {
  login: (payload: LoginPayload) => Promise<boolean>
  loading: boolean
  error: string | null
}

export function useLogin(): UseLoginReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setToken } = useAuth()

  const login = async ({ email, password }: LoginPayload): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const api = process.env.NEXT_PUBLIC_API_URL

      const response = await fetch(`${api}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message ?? 'Identifiants incorrects.')
        return false
      }

      const meRes = await fetch(`${api}/auth/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      })
      const me = await meRes.json()

      setToken(data.token, me.roles ?? [])
      return true
    } catch {
      setError('Impossible de contacter le serveur.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}
