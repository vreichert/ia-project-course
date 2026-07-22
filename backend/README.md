# JWT Authentication API — FastAPI + Poetry

API REST construida con **FastAPI** que implementa autenticación basada en **JSON Web Tokens (JWT)**. Incluye endpoint de login, emisión de access token y refresh token, y hashing seguro de contraseñas con `passlib[bcrypt]`.

---

## Tecnologías

| Herramienta | Descripción |
|---|---|
| Python 3.11 | Lenguaje base |
| FastAPI | Framework web asíncrono |
| Uvicorn | Servidor ASGI |
| python-jose | Generación y verificación de JWT |
| passlib + bcrypt | Hashing seguro de contraseñas (bcrypt >=3.2,<4.0) |
| pydantic-settings | Gestión de configuración vía variables de entorno |
| Poetry | Gestión de dependencias y entorno virtual |
| Docker / Docker Compose | Contenedorización y despliegue |

---

## Estructura del proyecto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py        # Aplicación FastAPI y endpoints
│   ├── auth.py        # Lógica JWT y verificación de contraseñas
│   ├── models.py      # Esquemas Pydantic (request / response)
│   └── config.py      # Configuración centralizada (pydantic-settings)
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml
└── README.md
```

---

## Endpoints

### `POST /auth/login`

Autentica al usuario y devuelve un par de tokens.

**Request body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 300
}
```

| Campo | Descripción |
|---|---|
| `access_token` | Token de acceso. Expira en **300 segundos**. |
| `refresh_token` | Token de refresco. Expira en **24 horas**. |

---

### `POST /auth/refresh`

Intercambia un refresh token válido por un nuevo par de tokens.

**Request body:**
```json
{
  "refresh_token": "<jwt>"
}
```

**Response:** igual al `/auth/login`.

---

### `GET /health`

Verificación de estado del servicio.

```json
{ "status": "ok" }
```

---

## Ejecución local con Poetry

### 1. Instalar Poetry

```bash
curl -sSL https://install.python-poetry.org | python3 -
```

### 2. Instalar dependencias

```bash
cd backend
poetry install
```

### 3. Ejecutar la aplicación

```bash
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

La API estará disponible en `http://localhost:8000`.  
La documentación interactiva (Swagger UI) en `http://localhost:8000/docs`.

---

## Ejecución con Docker Compose

```bash
cd backend
docker compose up --build
```

Para ejecutar en segundo plano:

```bash
docker compose up --build -d
```

Para detener:

```bash
docker compose down
```

---

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `SECRET_KEY` | Clave secreta para firmar los JWT | `change-this-secret-key-in-production` |
| `ALGORITHM` | Algoritmo de firma JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_SECONDS` | Duración del access token en segundos | `300` |
| `REFRESH_TOKEN_EXPIRE_SECONDS` | Duración del refresh token en segundos | `86400` |

Puedes crear un archivo `.env` en la carpeta `backend/` para sobreescribir estos valores localmente:

```env
SECRET_KEY=mi-clave-super-secreta
```

> **Importante:** Nunca expongas `SECRET_KEY` en repositorios públicos. Utiliza secrets del orquestador (Docker Swarm, Kubernetes, etc.) en producción.

---

## Ejemplo de uso con `curl`

### Login

```bash
curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | python -m json.tool
```

### Refresh

```bash
curl -s -X POST http://localhost:8000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "<refresh_token_obtenido_en_login>"}' | python -m json.tool
```

---

## Notas de seguridad

- Las contraseñas se almacenan como hash bcrypt; **nunca en texto plano**.
- La dependencia `bcrypt` está fijada en `>=3.2,<4.0` por incompatibilidad de `passlib 1.7.x` con bcrypt 4.x.
- En un entorno de producción, reemplaza el almacén de usuarios en memoria (`USERS_DB` en `auth.py`) por una base de datos real y gestiona `SECRET_KEY` como un secreto externo.
