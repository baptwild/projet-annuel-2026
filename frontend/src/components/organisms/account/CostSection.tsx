'use client'

import { Booking, Me } from '@/hooks/useMe'
import { computeBookingCosts, formatCost, getBillingDetail, BillingConfig, BILLING_MODE_LABELS } from '@/utils/billing'

type Props = {
   bookings: Booking[]
   me: NonNullable<Me>
}

const CostSection = ({ bookings, me }: Props) => {
   const d = me.daycare
   const config: BillingConfig = {
      billingMode: d.billingMode as BillingConfig['billingMode'],
      pricePerUnit: d.pricePerUnit,
      priceHalfDay: d.priceHalfDay,
      tierHoursThreshold: d.tierHoursThreshold,
      tierPrice: d.tierPrice,
      weeklyDiscountEnabled: d.weeklyDiscountEnabled,
      weeklyDiscountThreshold: d.weeklyDiscountThreshold,
      weeklyDiscountPercent: d.weeklyDiscountPercent,
   }

   if (!d.pricePerUnit && !d.priceHalfDay) return null

   const now = new Date()
   const monthBookings = bookings.filter(b => {
      if (b.status === 'cancelled') return false
      const date = new Date(b.startDate)
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
   })

   const withCosts = computeBookingCosts(monthBookings, config)
   const total = withCosts.reduce((sum, b) => sum + b.finalCost, 0)
   const totalSaving = withCosts.reduce((sum, b) => sum + b.saving, 0)
   const monthLabel = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

   const componentsClass = 'o_CostSection'
   const parentClass = 'o_MeSection'

   return (
      <section className={parentClass}>
         <h2 className={`${parentClass}-title`}>
            Estimation — {monthLabel}
            <span className={`p_Me_badge`}>{BILLING_MODE_LABELS[config.billingMode]}</span>
         </h2>
         {withCosts.length === 0 ? (
            <p className={`${parentClass}-empty`}>Aucune réservation ce mois-ci.</p>
         ) : (
            <>
               {d.weeklyDiscountEnabled && (
                  <p className={`${componentsClass}_costDiscount`}>
                     <i className='bi bi-tag' /> Remise de {d.weeklyDiscountPercent}% dès {d.weeklyDiscountThreshold} réservations/semaine
                  </p>
               )}
               <div className={`${componentsClass}_costList`}>
                  {withCosts.map(b => (
                     <div key={b['@id']} className={`${componentsClass}_costRow${b.discounted ? ' ${componentsClass}_costRow-discounted' : ''}`}>
                        <span className={`${componentsClass}_costDog`}>{b.dog.name}</span>
                        <span className={`${componentsClass}_costDate`}>
                           {new Date(b.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                           {' · '}
                           {new Date(b.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                           {' → '}
                           {new Date(b.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={`${componentsClass}_costDetail`}>{getBillingDetail(b.startDate, b.endDate, config)}</span>
                        <span className={`${componentsClass}_costAmount`}>
                           {b.discounted && <s className={`${componentsClass}_costStrike`}>{formatCost(b.baseCost)}</s>}
                           {formatCost(b.finalCost)}
                        </span>
                     </div>
                  ))}
               </div>
               <div className={`${componentsClass}_costTotal`}>
                  <span>
                     Total estimé
                     {totalSaving > 0 && <span className={`${componentsClass}_costSaving`}> (économie : {formatCost(totalSaving)})</span>}
                  </span>
                  <span className={`${componentsClass}_costTotalAmount`}>{formatCost(total)}</span>
               </div>
            </>
         )}
      </section>
   )
}

export default CostSection