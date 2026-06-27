import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as apiLogin, signup as apiSignup } from '../lib/api'
import { parseJwt } from '../lib/jwt'

const AuthContext = createContext(null)

const STORAGE_KEY = 'lp_auth'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      return parsed?.token || null
    } catch (e) {
      return null
    }
  })

  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      return parsed?.user || null
    } catch (e) {
      return null
    }
  })

  useEffect(() => {
    if (!token) return
    try {
      const payload = parseJwt(token)
      setUser({ email: payload.sub, role: payload.role || 'user' })
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: { email: payload.sub, role: payload.role || 'user' } }))
    } catch (e) {
      // invalid token
      setUser(null)
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [token])

  const login = async (email, password) => {
    const res = await apiLogin({ email, password })
    if (!res || !res.access_token) throw new Error('Login failed')
    setToken(res.access_token)
    return res
  }

  const signup = async (data) => {
    return apiSignup(data)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(() => ({ token, user, login, signup, logout }), [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
