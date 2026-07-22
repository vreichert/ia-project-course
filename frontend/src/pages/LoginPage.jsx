import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

/* ── Inline SVG — Airbnb belo ────────────────────────────────────────────── */
function BeloBrand({ size = 32 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="#ff385c"
      aria-label="airbnb"
      role="img"
    >
      {/*
        Simplified belo shape: two arcs meeting at the top with a teardrop
        point at the bottom — evokes the Airbnb brand mark.
      */}
      <path d="M16 2.6c-3.1 0-5.6 2.5-5.6 5.6 0 1.5.6 2.9 1.6 3.9l-4.4 7.6c-.6 1-.9 2.1-.9 3.3 0 3.5 2.8 6.4 6.4 6.4 1.9 0 3.6-.8 4.9-2.1 1.3 1.3 3 2.1 4.9 2.1 3.5 0 6.4-2.8 6.4-6.4 0-1.2-.3-2.3-.9-3.3l-4.4-7.6c1-.9 1.6-2.3 1.6-3.9 0-3.1-2.5-5.6-5.6-5.6zm0 2.4c1.8 0 3.2 1.4 3.2 3.2s-1.4 3.2-3.2 3.2-3.2-1.4-3.2-3.2 1.4-3.2 3.2-3.2zm0 9.2l3.8 6.6c-1.1.7-2.4 1.1-3.8 1.1s-2.7-.4-3.8-1.1L16 14.2zm-4.5 7.8c.5.4 1 .7 1.6.9-.9.6-1.9.9-3 .9-2.2 0-3.9-1.8-3.9-3.9 0-.7.2-1.4.5-2l4.8 4.1zm9 0l4.8-4.1c.3.6.5 1.3.5 2 0 2.2-1.8 3.9-3.9 3.9-1.1 0-2.1-.3-3-.9.6-.2 1.1-.5 1.6-.9z" />
    </svg>
  )
}

/* ── LoginPage ────────────────────────────────────────────────────────────── */
export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  const { login, isAuthenticated } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname ?? '/welcome'

  // Already logged in — redirect
  if (isAuthenticated) return <Navigate to={from} replace />

  async function handleSubmit(e) {
    e.preventDefault()
    const u = username.trim()
    if (!u || !password) return

    setError('')
    setLoading(true)
    try {
      const tokens = await loginUser(u, password)
      login(tokens, u)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ── styles ────────────────────────────────────────────────────────────── */
  const s = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-canvas)',
    },
    // Thin top bar with logo
    topBar: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px 24px',
      borderBottom: '1px solid var(--color-hairline-soft)',
    },
    // Main area centered
    main: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
    },
    // Card
    card: {
      width: '100%',
      maxWidth: '480px',
      backgroundColor: 'var(--color-surface-card)',
      borderRadius: 'var(--rounded-md)',
      boxShadow: 'var(--shadow-card)',
      padding: '40px 32px 32px',
    },
    heading: {
      fontSize: '22px',
      fontWeight: 600,
      lineHeight: 1.18,
      letterSpacing: '-0.44px',
      color: 'var(--color-ink)',
      marginBottom: '28px',
    },
    fieldGap: {
      marginBottom: '12px',
    },
    errorText: {
      fontSize: '14px',
      fontWeight: 400,
      color: 'var(--color-error)',
      marginTop: '8px',
      marginBottom: '16px',
      lineHeight: 1.43,
    },
    btnGap: {
      marginTop: '16px',
    },
    dividerWrap: {
      margin: '24px 0',
    },
    hint: {
      backgroundColor: 'var(--color-surface-soft)',
      borderRadius: 'var(--rounded-sm)',
      padding: '12px 14px',
      fontSize: '13px',
      color: 'var(--color-muted)',
      lineHeight: 1.43,
    },
    hintStrong: {
      color: 'var(--color-ink)',
      fontWeight: 600,
    },
    footer: {
      marginTop: '24px',
      paddingTop: '20px',
      borderTop: '1px solid var(--color-hairline-soft)',
      fontSize: '12px',
      color: 'var(--color-muted)',
      textAlign: 'center',
      lineHeight: 1.5,
    },
    showPassBtn: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--color-muted)',
      fontSize: '13px',
      fontWeight: 600,
      padding: '4px',
      fontFamily: 'var(--font-family)',
    },
    passWrapper: {
      position: 'relative',
    },
    passInput: {
      paddingRight: '64px',
    },
  }

  return (
    <div style={s.page}>
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <header style={s.topBar}>
        <BeloBrand size={32} />
        <span
          style={{
            marginLeft: '8px',
            fontSize: '22px',
            fontWeight: 600,
            color: 'var(--color-primary)',
            letterSpacing: '-0.5px',
          }}
        >
          airbnb
        </span>
      </header>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <main style={s.main}>
        <div style={s.card}>
          <h1 style={s.heading}>Iniciar sesión</h1>

          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div style={s.fieldGap}>
              <div className={`input-float${error && !password ? ' error' : ''}`}>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder=" "
                  autoComplete="username"
                  disabled={loading}
                  required
                />
                <label htmlFor="username">Usuario</label>
              </div>
            </div>

            {/* Password */}
            <div style={s.passWrapper} className="input-float">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder=" "
                autoComplete="current-password"
                disabled={loading}
                required
                style={s.passInput}
              />
              <label htmlFor="password">Contraseña</label>
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={s.showPassBtn}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                tabIndex={-1}
              >
                {showPass ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {/* Error */}
            {error && <p style={s.errorText} role="alert">{error}</p>}

            {/* Submit */}
            <div style={s.btnGap}>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !username.trim() || !password}
              >
                {loading ? 'Iniciando sesión…' : 'Continuar'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div style={s.dividerWrap}>
            <div className="divider">o</div>
          </div>

          {/* Demo credentials hint */}
          <div style={s.hint}>
            <span style={s.hintStrong}>Credenciales de demo:</span>
            {'  '}usuario{' '}
            <span style={s.hintStrong}>admin</span>
            {' '}/ contraseña{' '}
            <span style={s.hintStrong}>admin123</span>
          </div>

          {/* Legal footer */}
          <div style={s.footer}>
            Al continuar, aceptas nuestros{' '}
            <a
              href="#"
              style={{ color: 'var(--color-legal-link)', textDecoration: 'underline' }}
            >
              Términos de servicio
            </a>{' '}
            y{' '}
            <a
              href="#"
              style={{ color: 'var(--color-legal-link)', textDecoration: 'underline' }}
            >
              Política de privacidad
            </a>
            .
          </div>
        </div>
      </main>
    </div>
  )
}
