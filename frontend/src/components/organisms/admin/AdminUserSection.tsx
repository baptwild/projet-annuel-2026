'use client'

import React from 'react'
import { AdminUser, AdminDog } from '@/hooks/useAdminUsers'
import UserCard from '@/components/molecules/admin/UserCard'

interface AdminUserSectionProps {
  users: AdminUser[]
  dogs: AdminDog[]
  loading: boolean
}

export default function AdminUserSection({ users, dogs, loading }: AdminUserSectionProps) {
  const parentClass = 'p_Admin'

  return (
    <section className={`${parentClass}_section`}>
      {loading ? (
        <p className={`${parentClass}_empty`}>Chargement...</p>
      ) : users.length === 0 ? (
        <p className={`${parentClass}_empty`}>Aucun utilisateur.</p>
      ) : (
        <div className={`${parentClass}_list`}>
          {users.map(u => (
            <UserCard key={u['@id']} user={u} dogCount={dogs.filter(d => d.owner === u['@id']).length} />
          ))}
        </div>
      )}
    </section>
  )
}