'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useRegister } from '@/hooks/useRegister'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const { register, daycares, loading, error } = useRegister()
  const router = useRouter()

  const componentsClass = 'p_Register'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    if (password !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.')
      return
    }

    if (daycares.length === 0) return

    const success = await register({
      email,
      password,
      daycareId: daycares[0].id,
    })

    if (success) router.push('/login?registered=1')
  }

  return (
    <div className={componentsClass}>
      <div className={`${componentsClass}_container`}>
        <h1 className={`${componentsClass}_title`}>Créer un compte</h1>

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
              autoComplete='new-password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${componentsClass}_input`}
            />
          </div>

          <div className={`${componentsClass}_field`}>
            <label htmlFor='confirmPassword' className={`${componentsClass}_label`}>
              Confirmer le mot de passe
            </label>
            <input
              id='confirmPassword'
              type='password'
              autoComplete='new-password'
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${componentsClass}_input`}
            />
          </div>

          {daycares.length > 0 && (
            <p className={`${componentsClass}_daycare`}>
              Inscription pour : <strong>{daycares[0].name}</strong>
            </p>
          )}

          {(error || passwordError) && (
            <p className={`${componentsClass}_error`}>{passwordError ?? error}</p>
          )}

          <Button
            label={loading ? 'Inscription...' : "S'inscrire"}
            type='submit'
            color={ColorButton.PRIMARY}
            className={`${componentsClass}_submit`}
          />
        </form>

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
