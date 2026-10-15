# RegLog Frontend

React + Vite glassmorphism authentication UI.

## Stack

- React 18
- React Router
- Axios
- Lucide React icons
- Custom CSS

## Setup

```bash
npm install
```

Create `.env` from `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Run locally

```bash
npm run dev
```

Default Vite URL: `http://localhost:5173`

## Build

```bash
npm run build
npm run preview
```

## Authentication behavior

- JWT is never stored in `localStorage` or `sessionStorage`.
- The browser automatically sends the `access_token` HttpOnly cookie.
- Axios uses `withCredentials: true`.
- Protected routes call `/api/users/me` on startup.
- CSRF token is fetched from `/api/csrf` and sent as `X-XSRF-TOKEN` for unsafe requests.
- Logout and change-password revoke server-side sessions.

## Backend integration

Set `VITE_API_BASE_URL` to the backend API root, normally `http://localhost:8080/api`. CORS must allow the exact frontend origin.
