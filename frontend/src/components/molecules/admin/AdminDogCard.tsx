'use client'

import React from 'react'
import { AdminDog } from '@/hooks/useAdminUsers'

interface AdminDogCardProps {
  dog: AdminDog
  ownerName: string
  ownerEmail: string
}

export default function AdminDogCard({ dog, ownerName, ownerEmail }: AdminDogCardProps) {
  const componentsClass = 'm_AdminDogCard'

  return (
    <div className={componentsClass}>
      <div className={`${componentsClass}-avatar`}>
        <i className='bi bi-heart' />
      </div>
      <div className={`${componentsClass}-info`}>
        <span className={`${componentsClass}-name`}>{dog.name}</span>
        {dog.breed && <span className={`${componentsClass}-breed`}>{dog.breed}</span>}
        {dog.birthDate && (
          <span className={`${componentsClass}-birth`}>
            Né le {new Date(dog.birthDate).toLocaleDateString('fr-FR')}
          </span>
        )}
      </div>
      <div className={`${componentsClass}-owner`}>
        <i className='bi bi-person' />
        <span>{ownerName}</span>
        <span className={`${componentsClass}-ownerEmail`}>{ownerEmail}</span>
      </div>
    </div>
  )
}