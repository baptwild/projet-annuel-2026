'use client'
 
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
 
type AuthContextType = {
  isAuthenticated: boolean
  isAdmin: boolean
  userDaycareSlug: string | null
  setToken: (token: string, roles: string[], daycareSlug: string) => void
  logout: () => void
}
 
const AuthContext = createContext<AuthContextType | null>(null)
 
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userDaycareSlug, setUserDaycareSlug] = useState<string | null>(null)
 
  useEffect(() => {
    const token = localStorage.getItem('token')
    const roles: string[] = JSON.parse(localStorage.getItem('userRoles') ?? '[]')
    const slug = localStorage.getItem('userDaycareSlug') ?? null
    setIsAuthenticated(!!token)
    setIsAdmin(roles.includes('ROLE_ADMIN'))
    setUserDaycareSlug(slug)
  }, [])
 
  const setToken = (token: string, roles: string[], daycareSlug: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userRoles', JSON.stringify(roles))
    localStorage.setItem('userDaycareSlug', daycareSlug)
    setIsAuthenticated(true)
    setIsAdmin(roles.includes('ROLE_ADMIN'))
    setUserDaycareSlug(daycareSlug)
  }
 
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRoles')
    localStorage.removeItem('userDaycareSlug')
    setIsAuthenticated(false)
    setIsAdmin(false)
    setUserDaycareSlug(null)
  }
 
  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, userDaycareSlug, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
 
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}