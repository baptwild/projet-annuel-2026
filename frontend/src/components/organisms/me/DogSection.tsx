'use client'

import { useState, FormEvent } from 'react'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'
import { Dog } from '@/hooks/useMe'
import { authHeaders } from '@/utils/authHeaders'

const API = process.env.NEXT_PUBLIC_API_URL

const componentsClass = 'o_DogSection'
const parentClass = 'o_MeSection'

function DogRow({ dog, refetch }: { dog: Dog; refetch: () => void }) {
   const [name, setName] = useState(dog.name)
   const [breed, setBreed] = useState(dog.breed ?? '')
   const [open, setOpen] = useState(false)
   const [success, setSuccess] = useState(false)

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault()
      const res = await fetch(`${API}${dog['@id']}`, {
         method: 'PATCH',
         headers: authHeaders(),
         body: JSON.stringify({
            name, breed: breed || null
         }),
      })
      if (res.ok) {
         setSuccess(true)
         refetch()
         setTimeout(() => setOpen(false), 800)
      }
   }

   return (
      <div className={componentsClass}>
         <div className={`${componentsClass}-header`} onClick={() => setOpen(o => !o)}>
            <span className={`${componentsClass}-name`}>{dog.name}</span>
            <span className={`${componentsClass}-breed`}>{dog.breed ?? '—'}</span>
            <i className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
         </div>
         {open && (
            <form className={`${componentsClass}-form`} onSubmit={handleSubmit}>
               <div className={`${parentClass}-row`}>
                  <label>Nom</label>
                  <input value={name} onChange={e => setName(e.target.value)} required />
               </div>
               <div className={`${parentClass}-row`}>
                  <label>Race</label>
                  <input value={breed} onChange={e => setBreed(e.target.value)} />
               </div>
               {success && <p className={`${parentClass}-success`}>Enregistré.</p>}
               <Button
                  label='Enregistrer'
                  type='submit'
                  color={ColorButton.PRIMARY}
                  className={`${parentClass}-submit`}
               />
            </form>
         )}
      </div>
   )
}

function AddDogForm({ refetch }: { refetch: () => void }) {
   const [open, setOpen] = useState(false)
   const [name, setName] = useState('')
   const [breed, setBreed] = useState('')
   const [birthDate, setBirthDate] = useState('')
   const [error, setError] = useState<string | null>(null)

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault(); setError(null)
      const res = await fetch(`${API}/api/dogs`, {
         method: 'POST',
         headers: {
            ...authHeaders(),
            'Content-Type': 'application/ld+json'
         },
         body: JSON.stringify({
            name,
            breed: breed || null,
            birthDate: birthDate ? new Date(birthDate).toISOString() : null
         }),
      })
      if (res.ok) {
         setName('')
         setBreed('')
         setBirthDate('')
         setOpen(false)
         refetch()
      }
      else {
         setError("Erreur lors de l'ajout.")
      }
   }

   return (
      <div className={`${componentsClass} ${componentsClass}-add`}>
         <div className={`${componentsClass}-header`} onClick={() => setOpen(o => !o)}>
            <i className='bi bi-plus-circle' />
            <span className={`${componentsClass}-name`}>Ajouter un chien</span>
            <i className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
         </div>
         {open && (
            <form className={`${componentsClass}-form`} onSubmit={handleSubmit}>
               <div className={`${parentClass}-row`}>
                  <label>Nom *</label>
                  <input value={name} onChange={e => setName(e.target.value)} required />
               </div>
               <div className={`${parentClass}-row`}>
                  <label>Race</label>
                  <input value={breed} onChange={e => setBreed(e.target.value)} />
               </div>
               <div className={`${parentClass}-row`}>
                  <label>Date de naissance</label>
                  <input type='date' value={birthDate} onChange={e => setBirthDate(e.target.value)} />
               </div>
               {error && <p className={`${parentClass}-error`}>{error}</p>}
               <Button
                  label='Ajouter'
                  type='submit'
                  color={ColorButton.PRIMARY}
                  className={`${parentClass}-submit`}
               />
            </form>
         )}
      </div>
   )
}

type Props = {
   dogs: Dog[]
   refetch: () => void
}

const DogsSection = ({ dogs, refetch }: Props) => {
   return (
      <section className={parentClass}>
         <h2 className={`${parentClass}-title`}>Mes chiens</h2>
         {dogs.length === 0 && <p className={`${parentClass}-empty`}>Aucun chien enregistré.</p>}
         {dogs.map(dog => <DogRow key={dog['@id']} dog={dog} refetch={refetch} />)}
         <AddDogForm refetch={refetch} />
      </section>
   )
}

export default DogsSection