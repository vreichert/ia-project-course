/**
 * API service — communicates with the FastAPI backend.
 *
 * In development the Vite proxy forwards /auth/* requests to
 * http://localhost:8000, so no CORS headers are needed on the backend.
 * In production set VITE_API_URL to the absolute backend origin.
 */

const API_BASE = import.meta.env.VITE_API_URL ?? ''

/**
 * POST /auth/login
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{access_token: string, refresh_token: string, token_type: string, expires_in: number}>}
 */
export async function loginUser(username, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.detail ?? 'Usuario o contraseña incorrectos.')
  }

  return response.json()
}

/**
 * POST /auth/refresh
 * @param {string} refreshToken
 * @returns {Promise<{access_token: string, refresh_token: string, token_type: string, expires_in: number}>}
 */
export async function refreshAccessToken(refreshToken) {
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  if (!response.ok) {
    throw new Error('No se pudo renovar la sesión.')
  }

  return response.json()
}
