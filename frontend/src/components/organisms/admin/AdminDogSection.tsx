'use client'

import React from 'react'
import { AdminUser, AdminDog } from '@/hooks/useAdminUsers'
import AdminDogCard from '@/components/molecules/admin/AdminDogCard'

interface AdminDogSectionProps {
  dogs: AdminDog[]
  users: AdminUser[]
  loading: boolean
}

export default function AdminDogSection({ dogs, users, loading }: AdminDogSectionProps) {
  const parentClass = 'p_Admin'
  const userMap = new Map(users.map(u => [u['@id'], u]))

  return (
    <section className={`${parentClass}_section`}>
      {loading ? (
        <p className={`${parentClass}_empty`}>Chargement...</p>
      ) : dogs.length === 0 ? (
        <p className={`${parentClass}_empty`}>Aucun chien.</p>
      ) : (
        <div className={`${parentClass}_list`}>
          {dogs.map(d => {
            const owner = userMap.get(d.owner)
            const ownerName = owner ? [owner.firstName, owner.lastName].filter(Boolean).join(' ') || owner.email : '—'
            return <AdminDogCard key={d['@id']} dog={d} ownerName={ownerName} ownerEmail={owner?.email ?? '—'} />
          })}
        </div>
      )}
    </section>
  )
}