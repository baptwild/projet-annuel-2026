export function generateTimeSlots(opening: string, closing: string): string[] {
  const [openH, openM] = opening.split(':').map(Number)
  const [closeH, closeM] = closing.split(':').map(Number)
  const slots: string[] = []
  let totalMin = openH * 60 + openM
  const closeMin = closeH * 60 + closeM
  while (totalMin <= closeMin) {
    const h = Math.floor(totalMin / 60)
    const m = totalMin % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    totalMin += 30
  }
  return slots
}
