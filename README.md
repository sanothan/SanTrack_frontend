# SanTrack Frontend

React + Vite + Tailwind CSS frontend for the Rural Sanitation Inspection System.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Structure

- **api/**: Axios instance with JWT interceptor
- **context/**: Auth context for global state
- **routes/**: ProtectedRoute, RoleRoute
- **layouts/**: PublicLayout, DashboardLayout
- **components/**: Reusable UI components
- **pages/**: Route-based page components

## Roles

- **admin**: Full dashboard, user/village management, view all
- **inspector**: Inspections, assigned villages
- **communityLeader**: Report issues, view village status
