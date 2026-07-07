'use client'

import React from 'react'
import { AdminUser } from '@/hooks/useAdminUsers'

interface UserCardProps {
  user: AdminUser
  dogCount: number
}

export default function UserCard({ user, dogCount }: UserCardProps) {
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
  const isAdmin = user.roles.includes('ROLE_ADMIN')

  const componentsClass = 'm_UserCard'

  return (
    <div className={componentsClass}>
      <div className={`${componentsClass}-avatar`}>
        <i className={`bi ${isAdmin ? 'bi-shield-check' : 'bi-person'}`} />
      </div>
      <div className={`${componentsClass}-info`}>
        <span className={`${componentsClass}-name`}>{displayName}</span>
        <span className={`${componentsClass}-email`}>{user.email}</span>
      </div>
      <div className={`${componentsClass}-meta`}>
        <span className={`${componentsClass}-role${isAdmin ? ` ${componentsClass}-role-admin` : ''}`}>
          {isAdmin ? 'Admin' : 'Utilisateur'}
        </span>
        {!isAdmin && (
          <span className={`${componentsClass}-dogs`}>
            <i className='bi bi-heart' /> {dogCount} chien{dogCount > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}