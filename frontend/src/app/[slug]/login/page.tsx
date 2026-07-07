'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLogin } from '@/hooks/useLogin'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Form from '@/components/molecules/Form'
import { ColorButton } from '@/enums/ColorButton'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useLogin()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const justRegistered = searchParams.get('registered') === '1'

  useEffect(() => {
    if (isAuthenticated) router.replace(`/${slug}`)
  }, [isAuthenticated, router, slug])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const { success, slug: userSlug } = await login({ email, password })

    if (success) {
      router.replace(`/${userSlug ?? slug}`)
    }
  }
  
  const componentsClass = 'p_Login'

  return (
    <div className={componentsClass}>
      <div className={`${componentsClass}_container`}>
        <h1 className={`${componentsClass}_title`}>Connexion</h1>

        {justRegistered && (
          <p className={`${componentsClass}_success`}>
            Compte créé avec succès. Vous pouvez vous connecter.
          </p>
        )}

        <Form onSubmit={handleSubmit} className={`${componentsClass}_form`}>
          <Input
            id="email"
            label="Adresse e-mail *"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            id="password"
            label="Mot de passe *"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className={`${componentsClass}_error`}>{error}</p>}

          <Button
            label={loading ? 'Connexion...' : 'Se connecter'}
            type="submit"
            color={ColorButton.PRIMARY}
            className={`${componentsClass}_submit`}
            disabled={loading}
          />
        </Form>

        <p className={`${componentsClass}_switch`}>
          Pas encore de compte ?{' '}
          <Link href={`/${slug}/register`} className={`${componentsClass}_switch-link`}>
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}