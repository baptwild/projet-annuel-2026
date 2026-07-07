'use client'

import React, { FormEvent } from 'react'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'
import { BillingMode, BILLING_MODE_LABELS } from '@/utils/billing'
import { ALL_SLOTS, WEEK_DAYS } from '@/utils/adminHelpers'

interface AdminScheduleSectionProps {
  openingTime: string
  setOpeningTime: (val: string) => void
  closingTime: string
  setClosingTime: (val: string) => void
  openDays: number[]
  setOpenDays: React.Dispatch<React.SetStateAction<number[]>>
  billingMode: BillingMode
  setBillingMode: (val: BillingMode) => void
  pricePerUnit: number
  setPricePerUnit: (val: number) => void
  priceHalfDay: number
  setPriceHalfDay: (val: number) => void
  tierEnabled: boolean
  setTierEnabled: (val: boolean) => void
  tierHoursThreshold: number
  setTierHoursThreshold: (val: number) => void
  tierPrice: number
  setTierPrice: (val: number) => void
  weeklyDiscountEnabled: boolean
  setWeeklyDiscountEnabled: (val: boolean) => void
  weeklyDiscountThreshold: number
  setWeeklyDiscountThreshold: (val: number) => void
  weeklyDiscountPercent: number
  setWeeklyDiscountPercent: (val: number) => void
  maxDogsPerDay: number | null
  setMaxDogsPerDay: (val: number | null) => void
  onSubmit: (e: FormEvent) => Promise<void>
  saving: boolean
  success: boolean
  error: string | null
}

export default function AdminScheduleSection({
  openingTime,
  setOpeningTime,
  closingTime,
  setClosingTime,
  openDays,
  setOpenDays,
  billingMode,
  setBillingMode,
  pricePerUnit,
  setPricePerUnit,
  priceHalfDay,
  setPriceHalfDay,
  tierEnabled,
  setTierEnabled,
  tierHoursThreshold,
  setTierHoursThreshold,
  tierPrice,
  setTierPrice,
  weeklyDiscountEnabled,
  setWeeklyDiscountEnabled,
  weeklyDiscountThreshold,
  setWeeklyDiscountThreshold,
  weeklyDiscountPercent,
  setWeeklyDiscountPercent,
  maxDogsPerDay,
  setMaxDogsPerDay,
  onSubmit,
  saving,
  success,
  error
}: AdminScheduleSectionProps) {

  const closingSlots = ALL_SLOTS.filter(t => t > openingTime)

  const componentsClass = 'p_Admin'

  return (
    <section className={`${componentsClass}_section`}>
      <form className={`${componentsClass}_form`} onSubmit={onSubmit}>
        <div className={`${componentsClass}_times`}>
          <div className={`${componentsClass}_field`}>
            <label className={`${componentsClass}_label`}>Ouverture</label>
            <select className={`${componentsClass}_select`} value={openingTime} onChange={e => setOpeningTime(e.target.value)} required>
              {ALL_SLOTS.filter(t => t < closingTime || !closingTime).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className={`${componentsClass}_field`}>
            <label className={`${componentsClass}_label`}>Fermeture</label>
            <select className={`${componentsClass}_select`} value={closingTime} onChange={e => setClosingTime(e.target.value)} required>
              {closingSlots.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className={`${componentsClass}_field`}>
          <label className={`${componentsClass}_label`}>Jours d'ouverture</label>
          <div className={`${componentsClass}_days`}>
            {WEEK_DAYS.map(day => (
              <label key={day.value} className={`${componentsClass}_day`}>
                <input
                  type='checkbox'
                  checked={openDays.includes(day.value)}
                  onChange={e => {
                    if (e.target.checked) setOpenDays(prev => [...prev, day.value])
                    else setOpenDays(prev => prev.filter(v => v !== day.value))
                  }}
                />
                {day.label}
              </label>
            ))}
          </div>
        </div>
        <div className={`${componentsClass}_field`}>
          <label className={`${componentsClass}_label`}>Mode de facturation</label>
          <select className={`${componentsClass}_select`} value={billingMode} onChange={e => setBillingMode(e.target.value as BillingMode)}>
            {(Object.entries(BILLING_MODE_LABELS) as [BillingMode, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        {billingMode === 'hourly' ? (
          <>
            <div className={`${componentsClass}_field`}>
              <label className={`${componentsClass}_label`}>Tarif de base</label>
              <div className={`${componentsClass}_inputRow`}>
                <input className={`${componentsClass}_select`} type='number' min='0' step='0.5' value={pricePerUnit}
                  onChange={e => setPricePerUnit(parseFloat(e.target.value) || 0)} />
                <span className={`${componentsClass}_inputUnit`}>€ / heure</span>
              </div>
            </div>
            <label className={`${componentsClass}_toggle`}>
              <input type='checkbox' checked={tierEnabled} onChange={e => setTierEnabled(e.target.checked)} />
              <span>Tarif dégressif au-delà d'un certain nombre d'heures</span>
            </label>
            {tierEnabled && (
              <div className={`${componentsClass}_tier`}>
                <span className={`${componentsClass}_tierLabel`}>Au-delà de</span>
                <input className={`${componentsClass}_tierInput`} type='number' min='1' step='0.5' value={tierHoursThreshold}
                  onChange={e => setTierHoursThreshold(parseFloat(e.target.value) || 1)} />
                <span className={`${componentsClass}_tierLabel`}>h →</span>
                <input className={`${componentsClass}_tierInput`} type='number' min='0' step='0.5' value={tierPrice}
                  onChange={e => setTierPrice(parseFloat(e.target.value) || 0)} />
                <span className={`${componentsClass}_tierLabel`}>€ / heure</span>
              </div>
            )}
          </>
        ) : (
          <div className={`${componentsClass}_times`}>
            <div className={`${componentsClass}_field`}>
              <label className={`${componentsClass}_label`}>Demi-journée {'<'} 4h</label>
              <div className={`${componentsClass}_inputRow`}>
                <input className={`${componentsClass}_select`} type='number' min='0' step='0.5' value={priceHalfDay}
                  onChange={e => setPriceHalfDay(parseFloat(e.target.value) || 0)} />
                <span className={`${componentsClass}_inputUnit`}>€</span>
              </div>
            </div>
            <div className={`${componentsClass}_field`}>
              <label className={`${componentsClass}_label`}>Journée complète ≥ 4h</label>
              <div className={`${componentsClass}_inputRow`}>
                <input className={`${componentsClass}_select`} type='number' min='0' step='0.5' value={pricePerUnit}
                  onChange={e => setPricePerUnit(parseFloat(e.target.value) || 0)} />
                <span className={`${componentsClass}_inputUnit`}>€</span>
              </div>
            </div>
          </div>
        )}
        <div className={`${componentsClass}_divider`} />
        <label className={`${componentsClass}_toggle`}>
          <input type='checkbox' checked={weeklyDiscountEnabled} onChange={e => setWeeklyDiscountEnabled(e.target.checked)} />
          <span>Remise hebdomadaire</span>
        </label>
        {weeklyDiscountEnabled && (
          <div className={`${componentsClass}_tier`}>
            <span className={`${componentsClass}_tierLabel`}>À partir de</span>
            <input className={`${componentsClass}_tierInput`} type='number' min='2' step='1' value={weeklyDiscountThreshold}
              onChange={e => setWeeklyDiscountThreshold(parseInt(e.target.value) || 2)} />
            <span className={`${componentsClass}_tierLabel`}>réservations/semaine →</span>
            <input className={`${componentsClass}_tierInput`} type='number' min='0' max='100' step='1' value={weeklyDiscountPercent}
              onChange={e => setWeeklyDiscountPercent(parseFloat(e.target.value) || 0)} />
            <span className={`${componentsClass}_tierLabel`}>% de remise</span>
          </div>
        )}
        <div className={`${componentsClass}_divider`} />
        <div className={`${componentsClass}_field`}>
          <label className={`${componentsClass}_label`}>Capacité maximale par jour</label>
          <div className={`${componentsClass}_inputRow`}>
            <input className={`${componentsClass}_select`} type='number' min='1' step='1' placeholder='Illimitée'
              value={maxDogsPerDay ?? ''}
              onChange={e => setMaxDogsPerDay(e.target.value === '' ? null : parseInt(e.target.value))} />
            <span className={`${componentsClass}_inputUnit`}>chiens / jour</span>
          </div>
          <span className={`${componentsClass}_fieldHint`}>Laisser vide pour aucune limite</span>
        </div>
        {success && <p className={`${componentsClass}_success`}>Paramètres mis à jour.</p>}
        {error && <p className={`${componentsClass}_error`}>{error}</p>}
        <Button
          label={saving ? 'Enregistrement...' : 'Enregistrer'}
          type='submit'
          color={ColorButton.PRIMARY}
          className={`${componentsClass}_submit`}
        />
      </form>
    </section>
  )
}