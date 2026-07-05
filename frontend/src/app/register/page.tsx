'use client'

import { useState, FormEvent, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useRegister } from '@/hooks/useRegister'
import { useAuth } from '@/hooks/useAuth'
import { useLogin } from '@/hooks/useLogin'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'

const c = 'p_Register'

export default function RegisterPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { register, daycares, loading, error } = useRegister()
  const { login } = useLogin()
  const justRegistered = useRef(false)

  useEffect(() => {
    if (isAuthenticated && !justRegistered.current) router.replace('/')
  }, [isAuthenticated, router])

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
      await login({ email, password })
      router.push('/me')
    }
  }

  return (
    <div className={c}>
      <div className={`${c}_container`}>
        <h1 className={`${c}_title`}>Créer un compte</h1>

        <form className={`${c}_form`} onSubmit={handleSubmit}>
          <div className={`${c}_row`}>
            <div className={`${c}_field`}>
              <label className={`${c}_label`}>Prénom</label>
              <input
                type='text'
                autoComplete='given-name'
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className={`${c}_input`}
              />
            </div>
            <div className={`${c}_field`}>
              <label className={`${c}_label`}>Nom</label>
              <input
                type='text'
                autoComplete='family-name'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className={`${c}_input`}
              />
            </div>
          </div>

          <div className={`${c}_field`}>
            <label className={`${c}_label`}>Adresse e-mail *</label>
            <input
              type='email'
              autoComplete='email'
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`${c}_input`}
            />
          </div>

          <div className={`${c}_field`}>
            <label className={`${c}_label`}>Mot de passe *</label>
            <input
              type='password'
              autoComplete='new-password'
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`${c}_input`}
            />
          </div>

          <div className={`${c}_field`}>
            <label className={`${c}_label`}>Confirmer le mot de passe *</label>
            <input
              type='password'
              autoComplete='new-password'
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={`${c}_input`}
            />
          </div>

          {daycares.length > 1 && (
            <div className={`${c}_field`}>
              <label className={`${c}_label`}>Garderie *</label>
              <select
                required
                value={daycareId}
                onChange={e => setDaycareId(Number(e.target.value))}
                className={`${c}_input`}
              >
                <option value=''>Choisir une garderie</option>
                {daycares.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          )}

          {daycares.length === 1 && (
            <p className={`${c}_daycare`}>
              Inscription pour : <strong>{daycares[0].name}</strong>
            </p>
          )}

          {(error || passwordError) && (
            <p className={`${c}_error`}>{passwordError ?? error}</p>
          )}

          <Button
            label={loading ? 'Inscription...' : "S'inscrire"}
            type='submit'
            color={ColorButton.PRIMARY}
            className={`${c}_submit`}
          />
        </form>

        <p className={`${c}_switch`}>
          Déjà un compte ?{' '}
          <Link href='/login' className={`${c}_switch-link`}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
