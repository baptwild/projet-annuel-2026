'use client'

import { useState, FormEvent, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useRegister } from '@/hooks/useRegister'
import { useAuth } from '@/hooks/useAuth'
import { useLogin } from '@/hooks/useLogin'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'
import Input from '@/components/atoms/Input'
import Form from '@/components/molecules/Form'
import Select from '@/components/atoms/Select'

export default function RegisterPage() {
  const router = useRouter()
   const params = useParams()
  const slug = params.slug as string
  const { isAuthenticated } = useAuth()
  const { register, daycares, loading, error } = useRegister()
  const { login } = useLogin()
  const justRegistered = useRef(false)

  useEffect(() => {
    if (isAuthenticated && !justRegistered.current) router.replace(`/${slug}`)
  }, [isAuthenticated, router, slug])

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [daycareId, setDaycareId] = useState<number | ''>('')
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const selectedDaycareId = daycareId !== '' ? daycareId : daycares[0]?.id

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    if (password !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.')
      return
    }

    if (!selectedDaycareId) return

    const success = await register({ email, password, firstName, lastName, daycareId: selectedDaycareId })
    if (success) {
      justRegistered.current = true
      // await login({ email, password })
      // router.push('/me')
      
      const { success: loginOk, slug: userSlug } = await login({ email, password })
      if (loginOk) {
        router.push(`/${userSlug ?? slug}`)
      }
    }
  }

  const componentsClass = 'p_Register'

  return (
    <div className={componentsClass}>
      <div className={`${componentsClass}_container`}>
        <h1 className={`${componentsClass}_title`}>Créer un compte</h1>

        <Form onSubmit={handleSubmit} className={`${componentsClass}_form`}>
          <div className={`${componentsClass}_row`}>
            <Input
              id="firstName"
              label="Prénom"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              id="lastName"
              label="Nom"
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

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
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            id="confirmPassword"
            label="Confirmer le mot de passe *"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

         {daycares.length > 1 && (
          <Select
            id="daycare"
            label="Garderie *"
            required
            value={daycareId}
            placeholder="Choisir une garderie"
            onChange={(e) => setDaycareId(Number(e.target.value))}
            options={daycares.map((d) => ({
              value: d.id,
              label: d.name,
            }))}
          />
        )}

          {daycares.length === 1 && (
            <p className={`${componentsClass}_daycare`}>
              Inscription pour : <strong>{daycares[0].name}</strong>
            </p>
          )}

          {(error || passwordError) && (
            <p className={`${componentsClass}_error`}>{passwordError ?? error}</p>
          )}

          <Button
            label={loading ? 'Inscription...' : "S'inscrire"}
            type="submit"
            color={ColorButton.PRIMARY}
            className={`${componentsClass}_submit`}
            disabled={loading}
          />
        </Form>

        <p className={`${componentsClass}_switch`}>
          Déjà un compte ?{' '}
          <Link href='/login' className={`${componentsClass}_switch-link`}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
