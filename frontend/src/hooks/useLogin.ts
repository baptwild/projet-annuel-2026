'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

type LoginPayload = {
  email: string
  password: string
}

type LoginResult = {
  success: boolean
  slug: string | null
}

type UseLoginReturn = {
  login: (payload: LoginPayload) => Promise<LoginResult>
  loading: boolean
  error: string | null
}

export function useLogin(): UseLoginReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setToken } = useAuth()

  const login = async ({ email, password }: LoginPayload): Promise<LoginResult> => {
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
        return { success: false, slug: null }
      }

      const meRes = await fetch(`${api}/auth/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      })
      const me = await meRes.json()
      const daycareSlug: string = me.daycare?.slug ?? ''

      setToken(data.token, me.roles ?? [], daycareSlug)

      return { success: true, slug: daycareSlug || null }
    } catch {
      setError('Impossible de contacter le serveur.')
      return { success: false, slug: null }
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}