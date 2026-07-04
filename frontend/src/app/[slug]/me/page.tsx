'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMe } from '@/hooks/useMe'
import { useAuth } from '@/hooks/useAuth'
import AccountSection from '@/components/organisms/account/AccountSection'
import DogsSection from '@/components/organisms/account/DogSection'
import BookingsSection from '@/components/organisms/account/BookingSection'
import CostSection from '@/components/organisms/account/CostSection'

export default function MePage() {
  const { userDaycareSlug, isAuthenticated, logout } = useAuth()
  const { me, dogs, bookings, loading, refetch } = useMe()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/${slug}/login`)
      return
    }
    if (userDaycareSlug && userDaycareSlug !== slug) {
      logout()
      router.replace(`/${slug}/login`)
      return
    }
  }, [isAuthenticated, userDaycareSlug, slug, router, logout])

  useEffect(() => {
    if (loading || !me) return
    if (me.daycare.slug !== slug) {
      logout()
      router.replace(`/${slug}/login`)
    }
  }, [loading, me, slug, router, logout])

  if (!isAuthenticated || (userDaycareSlug && userDaycareSlug !== slug)) return null
  if (loading || !me) return null

  const componentsClass = 'p_Me'

  return (
    <div className={componentsClass}>
      <div className={`${componentsClass}_header`}>
        <h1 className={`${componentsClass}_title`}>
          Bonjour {me.firstName ?? me.email}
          {me.roles.includes('ROLE_ADMIN') && <span className={`${componentsClass}_badge`}>Admin</span>}
        </h1>
        <p className={`${componentsClass}_daycare`}>{me.daycare.name}</p>
      </div>

      <div className={`${componentsClass}_content`}>
        <div className={`${componentsClass}_content-row`}>
          <AccountSection me={me} refetch={refetch} />
          <DogsSection dogs={dogs} refetch={refetch} />
        </div>
        <BookingsSection bookings={bookings} refetch={refetch} />
        <CostSection bookings={bookings} me={me} />
      </div>
    </div>
  )
}