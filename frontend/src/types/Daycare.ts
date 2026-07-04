export type Daycare = {
  '@id'?: string
  '@type'?: string
  id: number
  name: string
  slug: string
  isActive: boolean
  openingTime: string
  closingTime: string
  openDays: number[]
  billingMode: 'hourly' | 'daily'
  pricePerUnit: number
  priceHalfDay: number
  tierHoursThreshold: number | null
  tierPrice: number | null
  weeklyDiscountEnabled: boolean
  weeklyDiscountThreshold: number
  weeklyDiscountPercent: number
  maxDogsPerDay: number | null
  address: string | null
  phone: string | null
  email: string | null
  facebook: string | null
  instagram: string | null
  colorPrimary: string | null
  colorSecondary: string | null
  colorTertiary: string | null
}