export type AvailableDate = {
  value: string
  label: string
}

const DAY_LABELS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
const MONTH_LABELS = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'aoû', 'sep', 'oct', 'nov', 'déc']

export function formatAvailableDate(value: string): string {
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return `${DAY_LABELS[date.getDay()]} ${date.getDate()} ${MONTH_LABELS[date.getMonth()]}`
}

export function generateAvailableDates(openDays: number[], count = 30): AvailableDate[] {
  const dates: AvailableDate[] = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  let checked = 0
  while (dates.length < count && checked < 365) {
    if (openDays.includes(cursor.getDay())) {
      const y = cursor.getFullYear()
      const m = String(cursor.getMonth() + 1).padStart(2, '0')
      const d = String(cursor.getDate()).padStart(2, '0')
      const value = `${y}-${m}-${d}`
      dates.push({ value, label: formatAvailableDate(value) })
    }
    cursor.setDate(cursor.getDate() + 1)
    checked++
  }
  return dates
}

/** Ensures a given date value is present in the list, even if outside the normal generated window (e.g. editing a booking made far in advance). */
export function withGuaranteedDate(dates: AvailableDate[], value: string): AvailableDate[] {
  if (dates.some(d => d.value === value)) return dates
  return [{ value, label: formatAvailableDate(value) }, ...dates].sort((a, b) => a.value.localeCompare(b.value))
}
