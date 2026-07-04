'use client'

import { useState, FormEvent } from 'react'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'
import { Me } from '@/hooks/useMe'
import { authHeaders } from '@/utils/authHeaders'

const API = process.env.NEXT_PUBLIC_API_URL

type Props = {
   me: NonNullable<Me>
   refetch: () => void
}

const AccountSection = ({ me, refetch }: Props) => {
   const [firstName, setFirstName] = useState(me.firstName ?? '')
   const [lastName, setLastName] = useState(me.lastName ?? '')
   const [email, setEmail] = useState(me.email)
   const [success, setSuccess] = useState(false)
   const [error, setError] = useState<string | null>(null)

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault()
      setSuccess(false); setError(null)
      const res = await fetch(`${API}/api/users/${me.id}`, {
         method: 'PATCH',
         headers: authHeaders(),
         body: JSON.stringify({
            firstName,
            lastName,
            email
         }),
      })
      if (res.ok) {
         setSuccess(true)
         refetch()
      }
      else {
         setError('Erreur lors de la mise à jour.')
      }
   }

   const componentsClass = 'o_MeSection'

   return (
      <section className={componentsClass}>
         <h2 className={`${componentsClass}-title`}>Mon compte</h2>
         <form className={`${componentsClass}-form`} onSubmit={handleSubmit}>
            <div className={`${componentsClass}-row`}>
               <label>Prénom</label>
               <input value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div className={`${componentsClass}-row`}>
               <label>Nom</label>
               <input value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
            <div className={`${componentsClass}-row`}>
               <label>Email</label>
               <input type='email' value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            {success && <p className={`${componentsClass}-success`}>Informations mises à jour.</p>}
            {error && <p className={`${componentsClass}-error`}>{error}</p>}
            <Button
               label='Enregistrer'
               type='submit'
               color={ColorButton.PRIMARY}
               className={`${componentsClass}-submit`}
            />
         </form>
      </section>
   )
}

export default AccountSection