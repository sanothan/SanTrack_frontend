# SanTrack Frontend

React + Vite client for SanTrack.

The frontend supports public pages and role-based dashboards for:

- admin
- inspector
- community

## Tech Stack

- React 19
- Vite 7
- React Router
- Axios
- Tailwind CSS
- Google OAuth (`@react-oauth/google`)

## Project Structure

```text
SanTrack_frontend/
  public/
  src/
    App.jsx
    main.jsx
    components/
    context/
    layouts/
    pages/
    services/
    utils/
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm 9+
- SanTrack backend running (default: `http://localhost:5000`)

### 1) Install dependencies

```bash
cd SanTrack_frontend
npm install
```

### 2) Configure environment variables

Create `.env` in `SanTrack_frontend`:

```env
# Used by src/services/api.js
VITE_API_BASE_URL=/api

# Used by src/services/scheduleService.js
VITE_API_URL=http://localhost:5000/api

# Required for Google sign-in
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Notes:

- In development, Vite proxies `/api` to `http://localhost:5000` via `vite.config.js`.
- If frontend and backend are deployed separately, set `VITE_API_BASE_URL` and `VITE_API_URL` to absolute backend URLs.

### 3) Run the app

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## Routing Documentation

### Public Routes

| Route       | Access    | Description                                      |
| ----------- | --------- | ------------------------------------------------ |
| `/`         | Public    | Home page                                        |
| `/about`    | Public    | About page                                       |
| `/contact`  | Public    | Contact page                                     |
| `/report`   | Public UI | Issue reporting page (submission requires login) |
| `/login`    | Public    | Login                                            |
| `/register` | Public    | Signup                                           |
| `/signup`   | Public    | Signup alias                                     |

### Authenticated User Routes

| Route       | Access                 | Description               |
| ----------- | ---------------------- | ------------------------- |
| `/profile`  | Any authenticated role | Profile management        |
| `/settings` | Any authenticated role | Placeholder settings page |

### Admin Routes

| Route               | Access | Description         |
| ------------------- | ------ | ------------------- |
| `/admin`            | Admin  | Admin dashboard     |
| `/admin/users`      | Admin  | User management     |
| `/admin/villages`   | Admin  | Village management  |
| `/admin/facilities` | Admin  | Facility management |
| `/admin/issues`     | Admin  | Issue tracking      |

### Inspector Routes

| Route                        | Access    | Description              |
| ---------------------------- | --------- | ------------------------ |
| `/inspector`                 | Inspector | Inspector dashboard      |
| `/inspector/facilities`      | Inspector | Facility management view |
| `/inspector/inspections`     | Inspector | Inspection management    |
| `/inspector/inspections/new` | Inspector | New inspection form      |
| `/inspector/schedule`        | Inspector | Tactical scheduler       |
| `/inspector/issues`          | Inspector | Issue tracking           |

### Community Routes

| Route                   | Access    | Description         |
| ----------------------- | --------- | ------------------- |
| `/community`            | Community | Community dashboard |
| `/community/facilities` | Community | Facility view       |
| `/community/issues`     | Community | Issue tracking      |

## API Endpoint Documentation (Frontend Integration)

The frontend calls backend APIs under `/api`.

### Authentication

| Method | Endpoint                | Used For                               |
| ------ | ----------------------- | -------------------------------------- |
| POST   | `/auth/login`           | Login with email/password              |
| POST   | `/auth/register`        | Register community user                |
| GET    | `/auth/profile`         | Fetch current profile                  |
| POST   | `/auth/google`          | Google login                           |
| POST   | `/auth/verify-password` | Password confirmation in profile flows |
| PUT    | `/auth/profile`         | Update profile/password                |
| POST   | `/auth/deactivate`      | Deactivate account                     |
| DELETE | `/auth/account`         | Delete account                         |

### Dashboard

| Method | Endpoint           | Used For                   |
| ------ | ------------------ | -------------------------- |
| GET    | `/dashboard/stats` | Admin dashboard statistics |

### Users

| Method | Endpoint     | Used For     |
| ------ | ------------ | ------------ |
| GET    | `/users`     | List users   |
| GET    | `/users/:id` | User details |
| POST   | `/users`     | Create user  |
| PUT    | `/users/:id` | Update user  |
| DELETE | `/users/:id` | Delete user  |

### Villages

| Method | Endpoint                    | Used For                       |
| ------ | --------------------------- | ------------------------------ |
| GET    | `/villages`                 | List villages                  |
| GET    | `/villages/:id`             | Village details                |
| POST   | `/villages`                 | Create village                 |
| PUT    | `/villages/:id`             | Update village                 |
| DELETE | `/villages/:id`             | Delete village                 |
| GET    | `/villages/reverse-geocode` | Resolve coordinates to address |

### Facilities

| Method | Endpoint          | Used For         |
| ------ | ----------------- | ---------------- |
| GET    | `/facilities`     | List facilities  |
| GET    | `/facilities/:id` | Facility details |
| POST   | `/facilities`     | Create facility  |
| PUT    | `/facilities/:id` | Update facility  |
| DELETE | `/facilities/:id` | Delete facility  |

Note:

- Backend exposes `GET /facilities/public` for public-only facility list.
- Current `facilityService.getPublicFacilities()` in frontend calls `/facilities`.

### Inspections

| Method | Endpoint                    | Used For               |
| ------ | --------------------------- | ---------------------- |
| GET    | `/inspections`              | List inspections       |
| GET    | `/inspections/:id`          | Inspection details     |
| GET    | `/inspections/sync-history` | Follow-up sync history |
| POST   | `/inspections`              | Create inspection      |
| PUT    | `/inspections/:id`          | Update inspection      |
| DELETE | `/inspections/:id`          | Delete inspection      |

### Issues

| Method | Endpoint      | Used For      |
| ------ | ------------- | ------------- |
| GET    | `/issues`     | List issues   |
| GET    | `/issues/:id` | Issue details |
| POST   | `/issues`     | Create issue  |
| PUT    | `/issues/:id` | Update issue  |

### Uploads

| Method | Endpoint         | Used For                |
| ------ | ---------------- | ----------------------- |
| POST   | `/uploads/image` | Upload inspection image |

### Schedules

| Method | Endpoint         | Used For        |
| ------ | ---------------- | --------------- |
| GET    | `/schedules`     | List schedules  |
| POST   | `/schedules`     | Create schedule |
| PATCH  | `/schedules/:id` | Update schedule |
| DELETE | `/schedules/:id` | Delete schedule |

## Authentication Behavior

- JWT is stored in localStorage as `token`.
- Most API calls use Axios interceptor in `services/api.js` to attach `Authorization: Bearer <token>`.
- 401 responses clear auth storage and redirect to `/login`.

## Deployment Notes

- Build with `npm run build` and deploy `dist/`.
- Ensure backend CORS allows your frontend origin.
- Set production API environment variables to backend HTTPS URLs.
