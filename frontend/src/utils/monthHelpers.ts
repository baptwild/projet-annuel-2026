export function getMonthBounds(offset: number): { start: Date; end: Date; label: string } {
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  const start = new Date(target.getFullYear(), target.getMonth(), 1, 0, 0, 0, 0)
  const end = new Date(target.getFullYear(), target.getMonth() + 1, 0, 23, 59, 59, 999)
  const rawLabel = target.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const label = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1)
  return { start, end, label }
}

export function inMonthRange(dateStr: string, start: Date, end: Date): boolean {
  const d = new Date(dateStr)
  return d >= start && d <= end
}
