export type BillingMode = 'hourly' | 'daily'

export type BillingConfig = {
  billingMode: BillingMode
  pricePerUnit: number
  priceHalfDay: number
  tierHoursThreshold: number | null
  tierPrice: number | null
  weeklyDiscountEnabled: boolean
  weeklyDiscountThreshold: number
  weeklyDiscountPercent: number
}

export const BILLING_MODE_LABELS: Record<BillingMode, string> = {
  hourly: 'À l\'heure',
  daily:  'Journée / Demi-journée',
}

function getISOWeekKey(dateStr: string): string {
  const date = new Date(dateStr)
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

export function getDurationHours(startDate: string, endDate: string): number {
  return (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60)
}

export function calculateBaseCost(startDate: string, endDate: string, config: BillingConfig): number {
  const h = getDurationHours(startDate, endDate)

  if (config.billingMode === 'hourly') {
    if (config.tierHoursThreshold && config.tierPrice !== null && h > config.tierHoursThreshold) {
      return (config.tierHoursThreshold * config.pricePerUnit)
           + ((h - config.tierHoursThreshold) * config.tierPrice)
    }
    return h * config.pricePerUnit
  } else {
    return h < 4 ? config.priceHalfDay : config.pricePerUnit
  }
}

export function getBillingDetail(startDate: string, endDate: string, config: BillingConfig): string {
  const h = getDurationHours(startDate, endDate)

  if (config.billingMode === 'hourly') {
    if (config.tierHoursThreshold && config.tierPrice !== null && h > config.tierHoursThreshold) {
      const over = Math.round((h - config.tierHoursThreshold) * 10) / 10
      return `${config.tierHoursThreshold}h × ${formatCost(config.pricePerUnit)} + ${over}h × ${formatCost(config.tierPrice)}`
    }
    return `${Math.round(h * 10) / 10}h × ${formatCost(config.pricePerUnit)}/h`
  } else {
    return h < 4 ? 'Demi-journée (< 4h)' : 'Journée complète (≥ 4h)'
  }
}

export function computeBookingCosts<T extends { '@id': string; startDate: string; endDate: string }>(
  bookings: T[],
  config: BillingConfig
): (T & { baseCost: number; finalCost: number; discounted: boolean; saving: number })[] {
  const weekCounts: Record<string, number> = {}
  bookings.forEach(b => {
    const key = getISOWeekKey(b.startDate)
    weekCounts[key] = (weekCounts[key] ?? 0) + 1
  })

  return bookings.map(b => {
    const baseCost = calculateBaseCost(b.startDate, b.endDate, config)
    const weekKey = getISOWeekKey(b.startDate)
    const discounted = config.weeklyDiscountEnabled
      && config.weeklyDiscountPercent > 0
      && (weekCounts[weekKey] ?? 0) >= config.weeklyDiscountThreshold
    const finalCost = discounted ? baseCost * (1 - config.weeklyDiscountPercent / 100) : baseCost
    return { ...b, baseCost, finalCost, discounted, saving: baseCost - finalCost }
  })
}

export function formatCost(amount: number): string {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}
