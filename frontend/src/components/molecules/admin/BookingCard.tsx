'use client'

import React from 'react'
import { AdminBooking } from '@/hooks/useAdminBookings'
import { formatDateTime, STATUS_LABELS } from '@/utils/adminHelpers'

interface BookingCardProps {
  booking: AdminBooking
  onConfirm: () => void
  onCancel: () => void
  onComplete: () => void
}

export default function BookingCard({ booking, onConfirm, onCancel, onComplete }: BookingCardProps) {
  const start = formatDateTime(booking.startDate)
  const end = formatDateTime(booking.endDate)
  const owner = booking.dog.owner
  const ownerName = [owner.firstName, owner.lastName].filter(Boolean).join(' ') || owner.email
  const isEndPast = new Date(booking.endDate) < new Date(new Date().toDateString())
  const canComplete = booking.status === 'confirmed' && isEndPast

  const componentsClass = 'm_BookingCard'

  return (
    <div className={`${componentsClass} ${componentsClass}-${booking.status}`}>
      <div className={`${componentsClass}-dog`}>
        <span className={`${componentsClass}-dogName`}>{booking.dog.name}</span>
        {booking.dog.breed && <span className={`${componentsClass}-breed`}>{booking.dog.breed}</span>}
      </div>
      <div className={`${componentsClass}-owner`}>
        <i className='bi bi-person' />
        <span>{ownerName}</span>
        <span className={`${componentsClass}-email`}>{owner.email}</span>
      </div>
      <div className={`${componentsClass}-schedule`}>
        <i className='bi bi-calendar3' />
        <span>{start.date}</span>
        <span className={`${componentsClass}-times`}>{start.time} → {end.time}</span>
      </div>
      <div className={`${componentsClass}-footer`}>
        <span className={`${componentsClass}-status`}>{STATUS_LABELS[booking.status] ?? booking.status}</span>
        <div className={`${componentsClass}-actions`}>
          {booking.status === 'pending' && (
            <button className={`${componentsClass}-btn ${componentsClass}-btn-confirm`} onClick={onConfirm}>
              <i className='bi bi-check-lg' /> Confirmer
            </button>
          )}
          {canComplete && (
            <button className={`${componentsClass}-btn ${componentsClass}-btn-complete`} onClick={onComplete}>
              <i className='bi bi-flag-fill' /> Terminer
            </button>
          )}
          {(booking.status === 'pending' || booking.status === 'confirmed') && (
            <button className={`${componentsClass}-btn ${componentsClass}-btn-cancel`} onClick={onCancel}>
              <i className='bi bi-x-lg' /> Annuler
            </button>
          )}
        </div>
      </div>
    </div>
  )
}