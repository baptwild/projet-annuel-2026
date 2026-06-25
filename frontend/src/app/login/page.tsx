'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLogin } from '@/hooks/useLogin'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useLogin()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const justRegistered = searchParams.get('registered') === '1'

  useEffect(() => {
    if (isAuthenticated) router.replace('/')
  }, [isAuthenticated, router])

  const componentsClass = 'p_Login'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const success = await login({ email, password })
    if (success) router.push('/')
  }

  return (
    <div className={componentsClass}>
      <div className={`${componentsClass}_container`}>
        <h1 className={`${componentsClass}_title`}>Connexion</h1>

        {justRegistered && (
          <p className={`${componentsClass}_success`}>
            Compte créé avec succès. Vous pouvez vous connecter.
          </p>
        )}

        <form className={`${componentsClass}_form`} onSubmit={handleSubmit}>
          <div className={`${componentsClass}_field`}>
            <label htmlFor='email' className={`${componentsClass}_label`}>
              Adresse e-mail
            </label>
            <input
              id='email'
              type='email'
              autoComplete='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${componentsClass}_input`}
            />
          </div>

          <div className={`${componentsClass}_field`}>
            <label htmlFor='password' className={`${componentsClass}_label`}>
              Mot de passe
            </label>
            <input
              id='password'
              type='password'
              autoComplete='current-password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${componentsClass}_input`}
            />
          </div>

          {error && <p className={`${componentsClass}_error`}>{error}</p>}

          <Button
            label={loading ? 'Connexion...' : 'Se connecter'}
            type='submit'
            color={ColorButton.PRIMARY}
            className={`${componentsClass}_submit`}
          />
        </form>

        <p className={`${componentsClass}_switch`}>
          Pas encore de compte ?{' '}
          <Link href='/register' className={`${componentsClass}_switch-link`}>
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}
