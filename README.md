# Airbnb Clone — Full-Stack Demo App

Aplicación web full-stack que demuestra autenticación JWT con un backend en **FastAPI** y un frontend en **React + Vite**, diseñada siguiendo el sistema de diseño Airbnb (`DESIGN-airbnb.md`).

---

## Arquitectura

```
iaBaufest/
├── backend/          # FastAPI — API REST con JWT
│   ├── app/
│   │   ├── main.py       # Endpoints: /auth/login, /auth/refresh, /health
│   │   ├── auth.py       # Lógica JWT (crear / verificar tokens)
│   │   ├── models.py     # Esquemas Pydantic
│   │   └── config.py     # Settings (SECRET_KEY, expiración, etc.)
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── pyproject.toml
│
├── frontend/         # React + Vite — SPA con rutas protegidas
│   ├── src/
│   │   ├── App.jsx              # Router principal
│   │   ├── main.jsx             # Entry point
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Estado de sesión (sessionStorage)
│   │   ├── services/
│   │   │   └── api.js           # Llamadas al backend
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx    # Formulario de login
│   │   │   └── WelcomePage.jsx  # Dashboard post-login
│   │   └── styles/
│   │       └── global.css       # Tokens de diseño Airbnb
│   ├── vite.config.js
│   └── package.json
│
├── DESIGN-airbnb.md  # Sistema de diseño
└── README.md         # Este archivo
```

---

## Páginas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/login` | Público | Formulario de inicio de sesión |
| `/welcome` | 🔒 Autenticado | Dashboard de bienvenida con exploración de destinos |
| `/*` | — | Redirige a `/login` |

Si un usuario no autenticado intenta acceder a `/welcome`, es redirigido automáticamente a `/login`. Tras autenticarse, es devuelto a la ruta de destino original.

---

## Características del frontend

- **React 18** con React Router v6
- **Rutas protegidas** — `ProtectedRoute` verifica la sesión antes de renderizar
- **Sesión en `sessionStorage`** — el token se borra automáticamente al cerrar el navegador
- **Token de acceso** — expira en 300 s (5 minutos); el contador en la página de bienvenida lo indica en tiempo real
- **Proxy Vite** — en desarrollo, `/auth/*` se redirige a `http://localhost:8000` sin necesidad de CORS
- **Sistema de diseño Airbnb** — colores, tipografía, radios y espaciados del archivo `DESIGN-airbnb.md`

---

## Credenciales de demo

| Campo | Valor |
|---|---|
| Usuario | `admin` |
| Contraseña | `admin123` |

---

## Instrucciones de uso

### Opción A — Docker Compose (backend) + Vite dev server (frontend)

#### 1. Levantar el backend

```bash
cd backend
docker compose up --build
```

El API queda disponible en `http://localhost:8000`.  
Documentación interactiva: `http://localhost:8000/docs`

#### 2. Instalar y levantar el frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación abre en `http://localhost:3000`.

---

### Opción B — Backend con Poetry (sin Docker)

```bash
cd backend
poetry install
poetry run uvicorn app.main:app --reload --port 8000
```

Luego levantar el frontend como en el paso 2 anterior.

---

### Build de producción

```bash
cd frontend
npm run build        # genera dist/
npm run preview      # sirve dist/ en http://localhost:4173
```

> **CORS en producción:** al servir el frontend desde un origen diferente al backend, agregar el middleware `fastapi.middleware.cors.CORSMiddleware` en `backend/app/main.py` y configurar `VITE_API_URL` con la URL absoluta del backend.

---

## Variables de entorno

### Backend (`backend/.env` o variables de Docker)

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `SECRET_KEY` | `change-this-secret-key-in-production` | Clave HMAC para firmar los JWT. **Cambiar en producción.** |
| `ALGORITHM` | `HS256` | Algoritmo de firma |
| `ACCESS_TOKEN_EXPIRE_SECONDS` | `300` | Duración del access token (segundos) |
| `REFRESH_TOKEN_EXPIRE_SECONDS` | `86400` | Duración del refresh token (segundos) |

### Frontend (`frontend/.env`)

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `VITE_API_URL` | *(vacío)* | URL base del backend. Vacío = usa el proxy de Vite. |

Copiar `frontend/.env.example` a `frontend/.env` para personalizar.

---

## Endpoints del backend

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Liveness probe |
| `POST` | `/auth/login` | Autenticar usuario, retorna access + refresh tokens |
| `POST` | `/auth/refresh` | Renovar tokens a partir de un refresh token válido |

### Ejemplo — login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 300
}
```

---

## Sistema de diseño

El frontend implementa fielmente el sistema de diseño definido en `DESIGN-airbnb.md`:

| Token | Valor |
|---|---|
| Color primario (Rausch) | `#ff385c` |
| Color de texto (Ink) | `#222222` |
| Canvas | `#ffffff` |
| Tipografía | Airbnb Cereal VF → Circular → system-ui |
| Border radius botones | `8px` (rounded-sm) |
| Border radius tarjetas | `14px` (rounded-md) |
| Search bar | `9999px` (pill, rounded-full) |

---

## Seguridad

- Las contraseñas se almacenan hasheadas con **bcrypt** (nunca en texto plano).
- Los JWT son firmados con HMAC-SHA256; cambiar `SECRET_KEY` en producción.
- El token de sesión se guarda en `sessionStorage` (se borra al cerrar el tab/navegador), no en `localStorage`.
- El proxy de Vite evita exponer el origen del backend durante el desarrollo.
