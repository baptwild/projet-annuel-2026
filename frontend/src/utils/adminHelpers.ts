import { AdminBooking } from '@/hooks/useAdminBookings'

export type Section = 'bookings' | 'users' | 'dogs' | 'schedule' | 'theme'

export const STATUS_TABS = [
  { key: 'pending',   label: 'En attente' },
  { key: 'confirmed', label: 'Confirmées' },
  { key: 'completed', label: 'Terminées' },
  { key: 'cancelled', label: 'Annulées' },
  { key: 'all',       label: 'Toutes' },
] as const

export type StatusFilter = typeof STATUS_TABS[number]['key']

export const STATUS_LABELS: Record<string, string> = {
  pending:   'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
  completed: 'Terminée',
}

export const WEEK_DAYS = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' },
]

export function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = 0; h <= 23; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
    slots.push(`${String(h).padStart(2, '0')}:30`)
  }
  return slots
}

export const ALL_SLOTS = generateTimeSlots()

export function formatDateTime(iso: string) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
    time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  }
}

export function getWeekBounds(offset: number): { start: Date; end: Date; label: string } {
  const now = new Date()
  const dayOfWeek = (now.getDay() + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek + offset * 7)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  return { start: monday, end: sunday, label: `${fmt(monday)} – ${fmt(sunday)} ${sunday.getFullYear()}` }
}

export function inWeek(b: AdminBooking, weekStart: Date, weekEnd: Date) {
  const d = new Date(b.startDate)
  return d >= weekStart && d <= weekEnd
}

export function getWeekDayList(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function onDay(b: AdminBooking, day: Date): boolean {
  return isSameDay(new Date(b.startDate), day)
}