import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { refreshAccessToken } from '../services/api'

/* ── Data: featured destinations ──────────────────────────────────────────── */
const DESTINATIONS = [
  {
    id: 1,
    city: 'Buenos Aires',
    country: 'Argentina',
    tagline: 'La París de Sudamérica',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    price: 'desde $45/noche',
    rating: '4.92',
    reviews: 2847,
  },
  {
    id: 2,
    city: 'Mendoza',
    country: 'Argentina',
    tagline: 'Tierra del malbec y la cordillera',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    price: 'desde $38/noche',
    rating: '4.87',
    reviews: 1423,
  },
  {
    id: 3,
    city: 'Bariloche',
    country: 'Argentina',
    tagline: 'Bosques, lagos y montañas',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    price: 'desde $62/noche',
    rating: '4.95',
    reviews: 3201,
  },
  {
    id: 4,
    city: 'Salta',
    country: 'Argentina',
    tagline: 'La linda del norte',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    price: 'desde $29/noche',
    rating: '4.88',
    reviews: 987,
  },
]

const CATEGORIES = [
  { label: 'Casas completas', icon: '🏠' },
  { label: 'Experiencias', icon: '🎭' },
  { label: 'Servicios', icon: '✨', badge: 'NEW' },
  { label: 'Cabañas', icon: '🪵' },
  { label: 'Frente al mar', icon: '🌊' },
  { label: 'Montaña', icon: '⛰️' },
]

/* ── Sub-components ───────────────────────────────────────────────────────── */

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 1l1.39 2.82L10.5 4.2l-2.25 2.19.53 3.1L6 7.94 3.22 9.49l.53-3.1L1.5 4.2l3.11-.38z" />
    </svg>
  )
}

function DestinationCard({ dest }) {
  const [hovered, setHovered] = useState(false)

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 'var(--rounded-md)',
        overflow: 'hidden',
        backgroundColor: 'var(--color-surface-card)',
        boxShadow: hovered ? 'var(--shadow-card)' : 'none',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
        cursor: 'pointer',
      }}
    >
      {/* Photo substitute */}
      <div
        style={{
          height: '200px',
          background: dest.gradient,
          borderRadius: 'var(--rounded-md)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '12px',
          position: 'relative',
        }}
      >
        {/* Guest-favorite badge */}
        <span
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'var(--color-canvas)',
            color: 'var(--color-ink)',
            fontSize: '11px',
            fontWeight: 600,
            lineHeight: 1.18,
            borderRadius: 'var(--rounded-full)',
            padding: '4px 10px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          }}
        >
          Favorito de huéspedes
        </span>
      </div>

      {/* Meta */}
      <div style={{ paddingTop: '10px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-ink)',
                lineHeight: 1.43,
              }}
            >
              {dest.city}, {dest.country}
            </p>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 400,
                color: 'var(--color-muted)',
                lineHeight: 1.43,
                marginTop: '2px',
              }}
            >
              {dest.tagline}
            </p>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 400,
                color: 'var(--color-ink)',
                lineHeight: 1.43,
                marginTop: '4px',
              }}
            >
              <strong>{dest.price}</strong>
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              color: 'var(--color-star-rating)',
              fontSize: '13px',
              fontWeight: 400,
              whiteSpace: 'nowrap',
            }}
          >
            <StarIcon />
            <span>{dest.rating}</span>
            <span style={{ color: 'var(--color-muted)' }}>
              ({dest.reviews.toLocaleString()})
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

function CategoryChip({ label, icon, badge }) {
  const [active, setActive] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setActive(v => !v)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px 10px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: active ? 'var(--color-ink)' : 'var(--color-muted)',
        borderBottom: active
          ? '2px solid var(--color-ink)'
          : '2px solid transparent',
        transition: 'color 0.15s, border-color 0.15s',
        fontFamily: 'var(--font-family)',
        position: 'relative',
        whiteSpace: 'nowrap',
      }}
    >
      {badge && (
        <span
          style={{
            position: 'absolute',
            top: '2px',
            right: '4px',
            backgroundColor: 'var(--color-canvas)',
            color: 'var(--color-ink)',
            fontSize: '8px',
            fontWeight: 700,
            letterSpacing: '0.32px',
            textTransform: 'uppercase',
            borderRadius: 'var(--rounded-full)',
            padding: '2px 4px',
            border: '1px solid var(--color-hairline)',
          }}
        >
          {badge}
        </span>
      )}
      <span style={{ fontSize: '22px', lineHeight: 1 }}>{icon}</span>
      <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: 1.29 }}>{label}</span>
    </button>
  )
}

function SessionBadge({ auth }) {
  const [secondsLeft, setSecondsLeft] = useState(null)

  useEffect(() => {
    if (!auth?.logged_at || !auth?.expires_in) return

    const update = () => {
      const elapsed = Math.floor((Date.now() - auth.logged_at) / 1000)
      const left = Math.max(0, auth.expires_in - elapsed)
      setSecondsLeft(left)
    }

    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [auth])

  if (secondsLeft === null) return null

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const isExpiring = secondsLeft < 60

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: 'var(--rounded-full)',
        backgroundColor: isExpiring ? '#fff3f5' : 'var(--color-surface-soft)',
        border: `1px solid ${isExpiring ? 'var(--color-primary-disabled)' : 'var(--color-hairline)'}`,
        fontSize: '13px',
        color: isExpiring ? 'var(--color-primary)' : 'var(--color-muted)',
        fontWeight: 500,
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isExpiring ? 'var(--color-primary)' : '#22c55e',
          flexShrink: 0,
          animation: isExpiring ? 'none' : undefined,
        }}
      />
      {secondsLeft === 0
        ? 'Sesión expirada'
        : `Sesión activa · expira en ${mins}:${String(secs).padStart(2, '0')}`}
    </div>
  )
}

/* ── WelcomePage ─────────────────────────────────────────────────────────── */
export function WelcomePage() {
  const { auth, logout } = useAuth()
  const navigate         = useNavigate()
  const [activeTab, setActiveTab] = useState('Homes')

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const username = auth?.username ?? 'usuario'

  /* ── styles ────────────────────────────────────────────────────────────── */
  const s = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-canvas)',
    },

    /* NAV */
    nav: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--color-canvas)',
      borderBottom: '1px solid var(--color-hairline-soft)',
    },
    navInner: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      flexShrink: 0,
      textDecoration: 'none',
    },
    logoText: {
      fontSize: '22px',
      fontWeight: 600,
      color: 'var(--color-primary)',
      letterSpacing: '-0.5px',
    },
    navTabs: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      flex: 1,
      justifyContent: 'center',
    },
    navRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexShrink: 0,
    },
    avatarPill: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 6px 6px 12px',
      borderRadius: 'var(--rounded-full)',
      border: '1px solid var(--color-hairline)',
      backgroundColor: 'var(--color-canvas)',
      cursor: 'default',
    },
    avatar: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      backgroundColor: 'var(--color-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--color-on-primary)',
      fontSize: '13px',
      fontWeight: 600,
      flexShrink: 0,
    },
    avatarName: {
      fontSize: '14px',
      fontWeight: 600,
      color: 'var(--color-ink)',
      maxWidth: '120px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },

    /* HERO */
    hero: {
      background: 'linear-gradient(135deg, #ff385c 0%, #e31c5f 40%, #c13515 100%)',
      padding: '64px 24px',
      textAlign: 'center',
      color: 'var(--color-on-primary)',
    },
    heroInner: {
      maxWidth: '680px',
      margin: '0 auto',
    },
    heroTitle: {
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: 1.43,
      marginBottom: '12px',
    },
    heroSubtitle: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
      opacity: 0.9,
      marginBottom: '32px',
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'var(--color-canvas)',
      borderRadius: 'var(--rounded-full)',
      padding: '14px 16px 14px 24px',
      maxWidth: '580px',
      margin: '0 auto',
      boxShadow: 'var(--shadow-card)',
      gap: '8px',
      cursor: 'text',
    },
    searchText: {
      flex: 1,
      fontSize: '14px',
      color: 'var(--color-muted)',
    },
    searchOrb: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      backgroundColor: 'var(--color-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      cursor: 'pointer',
      border: 'none',
      transition: 'background-color 0.1s',
    },

    /* CONTENT */
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
      width: '100%',
    },

    /* CATEGORY STRIP */
    categoryStrip: {
      display: 'flex',
      gap: '0',
      overflowX: 'auto',
      borderBottom: '1px solid var(--color-hairline-soft)',
      paddingTop: '24px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    },

    /* SESSION SECTION */
    sessionSection: {
      paddingTop: '32px',
      paddingBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
    },

    /* GRID */
    sectionTitle: {
      fontSize: '22px',
      fontWeight: 500,
      lineHeight: 1.18,
      letterSpacing: '-0.44px',
      color: 'var(--color-ink)',
      marginBottom: '20px',
      marginTop: '36px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '24px',
      marginBottom: '48px',
    },

    /* FOOTER */
    footer: {
      marginTop: 'auto',
      backgroundColor: 'var(--color-canvas)',
      borderTop: '1px solid var(--color-hairline-soft)',
      padding: '32px 24px',
    },
    footerInner: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
    },
    footerText: {
      fontSize: '14px',
      color: 'var(--color-muted)',
    },
    footerLinks: {
      display: 'flex',
      gap: '24px',
      flexWrap: 'wrap',
    },
    footerLink: {
      fontSize: '14px',
      color: 'var(--color-muted)',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      fontFamily: 'var(--font-family)',
      padding: 0,
      transition: 'color 0.15s',
    },
  }

  const tabs = ['Homes', 'Experiences', 'Services']

  return (
    <div style={s.page}>
      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav style={s.nav} aria-label="Main navigation">
        <div style={s.navInner}>
          {/* Logo */}
          <a style={s.logo} href="#" aria-label="airbnb home">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              width={28}
              height={28}
              fill="#ff385c"
              aria-hidden="true"
            >
              <path d="M16 2.6c-3.1 0-5.6 2.5-5.6 5.6 0 1.5.6 2.9 1.6 3.9l-4.4 7.6c-.6 1-.9 2.1-.9 3.3 0 3.5 2.8 6.4 6.4 6.4 1.9 0 3.6-.8 4.9-2.1 1.3 1.3 3 2.1 4.9 2.1 3.5 0 6.4-2.8 6.4-6.4 0-1.2-.3-2.3-.9-3.3l-4.4-7.6c1-.9 1.6-2.3 1.6-3.9 0-3.1-2.5-5.6-5.6-5.6zm0 2.4c1.8 0 3.2 1.4 3.2 3.2s-1.4 3.2-3.2 3.2-3.2-1.4-3.2-3.2 1.4-3.2 3.2-3.2zm0 9.2l3.8 6.6c-1.1.7-2.4 1.1-3.8 1.1s-2.7-.4-3.8-1.1L16 14.2zm-4.5 7.8c.5.4 1 .7 1.6.9-.9.6-1.9.9-3 .9-2.2 0-3.9-1.8-3.9-3.9 0-.7.2-1.4.5-2l4.8 4.1zm9 0l4.8-4.1c.3.6.5 1.3.5 2 0 2.2-1.8 3.9-3.9 3.9-1.1 0-2.1-.3-3-.9.6-.2 1.1-.5 1.6-.9z" />
            </svg>
            <span style={s.logoText}>airbnb</span>
          </a>

          {/* Product tabs */}
          <div style={s.navTabs} role="tablist">
            {tabs.map(tab => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                className={`nav-tab${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {tab !== 'Homes' && (
                  <span
                    style={{
                      marginLeft: '4px',
                      fontSize: '8px',
                      fontWeight: 700,
                      letterSpacing: '0.32px',
                      textTransform: 'uppercase',
                      backgroundColor: 'var(--color-canvas)',
                      color: 'var(--color-ink)',
                      border: '1px solid var(--color-hairline)',
                      borderRadius: 'var(--rounded-full)',
                      padding: '2px 4px',
                      verticalAlign: 'middle',
                    }}
                  >
                    NEW
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Right: user pill + logout */}
          <div style={s.navRight}>
            <div style={s.avatarPill}>
              <span style={s.avatarName}>{username}</span>
              <div style={s.avatar} aria-hidden="true">
                {username.charAt(0).toUpperCase()}
              </div>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleLogout}
              style={{ height: '36px', fontSize: '13px' }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section style={s.hero} aria-label="Welcome hero">
        <div style={s.heroInner}>
          <h1 style={s.heroTitle}>
            ¡Bienvenido de nuevo, {username}! 👋
          </h1>
          <p style={s.heroSubtitle}>
            Estás autenticado correctamente. Inspírate para tu próximo viaje.
          </p>
          {/* Decorative search bar */}
          <div style={s.searchBar} role="search" aria-label="Search destinations">
            <span style={{ fontSize: '16px' }}>🔍</span>
            <span style={s.searchText}>¿A dónde quieres ir?</span>
            <span
              style={{
                width: '1px',
                height: '24px',
                backgroundColor: 'var(--color-hairline)',
                flexShrink: 0,
              }}
            />
            <span style={{ ...s.searchText, borderLeft: 'none' }}>¿Cuándo?</span>
            <span
              style={{
                width: '1px',
                height: '24px',
                backgroundColor: 'var(--color-hairline)',
                flexShrink: 0,
              }}
            />
            <span style={s.searchText}>¿Quiénes?</span>
            <button
              type="button"
              style={s.searchOrb}
              aria-label="Buscar"
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-active)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zm8.28.68-4.4-4.4a8.97 8.97 0 0 1-1.42 1.42l4.4 4.4a1 1 0 1 0 1.42-1.42z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div style={s.content}>
        {/* Category strip */}
        <div style={s.categoryStrip} role="tablist" aria-label="Property categories">
          {CATEGORIES.map(cat => (
            <CategoryChip key={cat.label} {...cat} />
          ))}
        </div>

        {/* Session status */}
        <div style={s.sessionSection}>
          <SessionBadge auth={auth} />
          <span style={{ fontSize: '13px', color: 'var(--color-muted)' }}>
            Tu token de acceso se renueva automáticamente.
          </span>
        </div>

        {/* Destinations grid */}
        <h2 style={s.sectionTitle}>Destinos inspiradores para tu próxima estadía</h2>
        <div style={s.grid}>
          {DESTINATIONS.map(dest => (
            <DestinationCard key={dest.id} dest={dest} />
          ))}
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <p style={s.footerText}>© 2025 Airbnb Clone — Demo App</p>
          <div style={s.footerLinks}>
            {['Privacidad', 'Condiciones', 'Mapa del sitio', 'Español (AR)'].map(link => (
              <button
                key={link}
                type="button"
                style={s.footerLink}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-ink)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
