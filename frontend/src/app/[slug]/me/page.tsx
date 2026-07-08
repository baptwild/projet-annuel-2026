'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMe } from '@/hooks/useMe'
import { useAuth } from '@/hooks/useAuth'
import AccountSection from '@/components/organisms/me/AccountSection'
import DogsSection from '@/components/organisms/me/DogSection'
import BookingsSection from '@/components/organisms/me/BookingSection'
import CostSection from '@/components/organisms/me/CostSection'
import { getMonthBounds, inMonthRange } from '@/utils/monthHelpers'

export default function MePage() {
  const { userDaycareSlug, isAuthenticated, logout } = useAuth()
  const { me, dogs, bookings, loading, refetch } = useMe()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const [monthOffset, setMonthOffset] = useState(0)

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

  const month = getMonthBounds(monthOffset)
  const monthBookings = bookings
    .filter(b => inMonthRange(b.startDate, month.start, month.end))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

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
        <div className={`${componentsClass}_monthNav`}>
          <button className={`${componentsClass}_monthBtn`} onClick={() => setMonthOffset(o => o - 1)}>
            <i className='bi bi-chevron-left' />
          </button>
          <div className={`${componentsClass}_monthLabel`}>
            <span>{month.label}</span>
            {monthOffset !== 0 && (
              <button className={`${componentsClass}_monthToday`} onClick={() => setMonthOffset(0)}>Ce mois-ci</button>
            )}
          </div>
          <button className={`${componentsClass}_monthBtn`} onClick={() => setMonthOffset(o => o + 1)}>
            <i className='bi bi-chevron-right' />
          </button>
        </div>
        <BookingsSection
          bookings={monthBookings}
          refetch={refetch}
          monthLabel={month.label}
          openingTime={me.daycare.openingTime}
          closingTime={me.daycare.closingTime}
          openDays={me.daycare.openDays}
        />
        <CostSection bookings={monthBookings} me={me} monthLabel={month.label} />
      </div>
    </div>
  )
}