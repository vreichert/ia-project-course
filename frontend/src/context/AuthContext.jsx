import { createContext, useContext, useState, useCallback } from 'react'

const AUTH_KEY = 'airbnb_auth'
const AuthContext = createContext(null)

/** Read the persisted auth payload from sessionStorage. */
function readStoredAuth() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * AuthProvider — wraps the application and exposes:
 *   auth            — the stored payload (tokens + username) or null
 *   isAuthenticated — boolean shorthand
 *   login(tokens, username) — persists the session
 *   logout()        — clears the session
 */
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth)

  const login = useCallback((tokens, username) => {
    const payload = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      logged_at: Date.now(),
      username,
    }
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(payload))
    setAuth(payload)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY)
    setAuth(null)
  }, [])

  const value = {
    auth,
    isAuthenticated: !!(auth?.access_token),
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** Custom hook — throws if used outside AuthProvider. */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
