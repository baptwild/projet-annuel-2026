'use client'

import React, { useState } from 'react'
import { AdminBooking } from '@/hooks/useAdminBookings'
import BookingCard from '@/components/molecules/admin/BookingCard'
import {
  StatusFilter,
  STATUS_TABS,
  getWeekBounds,
  inWeek
} from '@/utils/adminHelpers'
import {
  computeBookingCosts,
  formatCost,
  BillingConfig,
  BILLING_MODE_LABELS
} from '@/utils/billing'

interface AdminBookingSectionProps {
  bookings: AdminBooking[]
  loading: boolean
  updateStatus: (id: string, status: 'confirmed' | 'cancelled' | 'completed') => void
  billingConfig: BillingConfig
}

export default function AdminBookingSection({ bookings, loading, updateStatus, billingConfig }: AdminBookingSectionProps) {
  const [filter, setFilter] = useState<StatusFilter>('pending')
  const [weekOffset, setWeekOffset] = useState(0)

  const week = getWeekBounds(weekOffset)

  const byStatus = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)
  const filtered = byStatus.filter(b => inWeek(b, week.start, week.end))
  const pendingThisWeek = bookings.filter(b => b.status === 'pending' && inWeek(b, week.start, week.end)).length

  const now = new Date()
  const inCurrentMonth = (b: AdminBooking) => {
    const d = new Date(b.startDate)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }

  const allMonthCosts = computeBookingCosts(
    bookings.filter(b => b.status !== 'cancelled' && inCurrentMonth(b)),
    billingConfig,
  )

  const completedRevenue = allMonthCosts.filter(b => b.status === 'completed').reduce((s, b) => s + b.finalCost, 0)
  const upcomingRevenue = allMonthCosts.filter(b => b.status !== 'completed').reduce((s, b) => s + b.finalCost, 0)
  const totalRevenue = completedRevenue + upcomingRevenue
  const completedCount = allMonthCosts.filter(b => b.status === 'completed').length
  const upcomingCount = allMonthCosts.filter(b => b.status !== 'completed').length
  const hasPrice = billingConfig.pricePerUnit > 0 || billingConfig.priceHalfDay > 0

  const componentsClass = 'o_AdminBookingSection'
  const parentClass = 'p_Admin'

  return (
    <section className={`${parentClass}_section`}>
      {hasPrice && (
        <div className={`${componentsClass}_revenue`}>
          <div className={`${componentsClass}_revenueTotal`}>{formatCost(totalRevenue)}</div>
          <div className={`${componentsClass}_revenueLabel`}>
            Total du mois · {BILLING_MODE_LABELS[billingConfig.billingMode]}
            {billingConfig.weeklyDiscountEnabled && ` · remise −${billingConfig.weeklyDiscountPercent}% dès ${billingConfig.weeklyDiscountThreshold} rés./semaine`}
          </div>
          <div className={`${componentsClass}_revenueBreakdown`}>
            <div className={`${componentsClass}_revenueItem`}>
              <span className={`${componentsClass}_revenueItemLabel`}>Réalisé</span>
              <span className={`${componentsClass}_revenueItemAmount ${componentsClass}_revenueItemAmount-done`}>{formatCost(completedRevenue)}</span>
              <span className={`${componentsClass}_revenueItemCount`}>{completedCount} terminée{completedCount > 1 ? 's' : ''}</span>
            </div>
            <div className={`${componentsClass}_revenueSep`} />
            <div className={`${componentsClass}_revenueItem`}>
              <span className={`${componentsClass}_revenueItemLabel`}>À venir</span>
              <span className={`${componentsClass}_revenueItemAmount ${componentsClass}_revenueItemAmount-upcoming`}>{formatCost(upcomingRevenue)}</span>
              <span className={`${componentsClass}_revenueItemCount`}>{upcomingCount} réservation{upcomingCount > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      )}

      <div className={`${componentsClass}_weekNav`}>
        <button className={`${componentsClass}_weekBtn`} onClick={() => setWeekOffset(o => o - 1)}>
          <i className='bi bi-chevron-left' />
        </button>
        <div className={`${componentsClass}_weekLabel`}>
          <span>{week.label}</span>
          {weekOffset !== 0 && (
            <button className={`${componentsClass}_weekToday`} onClick={() => setWeekOffset(0)}>Aujourd'hui</button>
          )}
        </div>
        <button className={`${componentsClass}_weekBtn`} onClick={() => setWeekOffset(o => o + 1)}>
          <i className='bi bi-chevron-right' />
        </button>
      </div>

      <div className={`${componentsClass}_tabs`}>
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            className={`${componentsClass}_tab${filter === tab.key ? ` ${componentsClass}_tab-active` : ''}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
            {tab.key === 'pending' && pendingThisWeek > 0 && ` (${pendingThisWeek})`}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={`${parentClass}_empty`}>Chargement...</p>
      ) : filtered.length === 0 ? (
        <p className={`${parentClass}_empty`}>Aucune réservation cette semaine.</p>
      ) : (
        <div className={`${componentsClass}_bookings`}>
          {filtered.map(b => (
            <BookingCard
              key={b['@id']}
              booking={b}
              onConfirm={() => updateStatus(b['@id'], 'confirmed')}
              onCancel={() => updateStatus(b['@id'], 'cancelled')}
              onComplete={() => updateStatus(b['@id'], 'completed')}
            />
          ))}
        </div>
      )}
    </section>
  )
}