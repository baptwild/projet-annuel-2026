'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type AuthContextType = {
  isAuthenticated: boolean
  isAdmin: boolean
  setToken: (token: string, roles: string[]) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const roles: string[] = JSON.parse(localStorage.getItem('userRoles') ?? '[]')
    setIsAuthenticated(!!token)
    setIsAdmin(roles.includes('ROLE_ADMIN'))
  }, [])

  const setToken = (token: string, roles: string[]) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userRoles', JSON.stringify(roles))
    setIsAuthenticated(true)
    setIsAdmin(roles.includes('ROLE_ADMIN'))
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRoles')
    setIsAuthenticated(false)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
