'use client'

import { createContext, useContext, ReactNode } from 'react'
import { Daycare } from '@/types/Daycare'

const DaycareContext = createContext<Daycare | null>(null)

export function DaycareProvider({
  daycare,
  children,
}: {
  daycare: Daycare
  children: ReactNode
}) {
  return (
    <DaycareContext.Provider value={daycare}>
      {children}
    </DaycareContext.Provider>
  )
}

export function useDaycare(): Daycare {
  const ctx = useContext(DaycareContext)
  if (!ctx) throw new Error('useDaycare must be used inside a [slug] route')
  return ctx
}

export function useDaycareSafe(): Daycare | null {
  return useContext(DaycareContext)
}