# SanTrack Frontend

The client-side web application for the SanTrack platform. Built with React and Vite, it serves multiple distinct user roles (Admin, Inspector, Community, and Public) to monitor and optimize rural sanitation and water access.

## Tech Stack

*   **Framework:** React 18
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM (v6)
*   **Icons:** Lucide React
*   **HTTP Client:** Axios
*   **Components:** Custom UI styled directly with Tailwind classes

## Key Features

1.  **Public Portal:** An entry site outlining the project mission with tools for anonymous users to report sanitation issues and view contact details securely.
2.  **Role-Based Dashboards:**
    *   **Admin Dashboard:** Overview of users, villages, facilities, inspections, and platform-wide issues.
    *   **Inspector Dashboard:** Focused tools for conducting field inspections, logging hygiene scores, and attaching photo evidence.
    *   **Community Dashboard:** Ability to view local facilities, track personal reported issues, and coordinate easily.
3.  **Authentication Flow:** Secure JWT handling managed via a central `AuthContext`.
4.  **Responsive Layouts:** Sidebar vs Top-nav layouts dynamically adjusting per auth-level using `DashboardLayout` and `PublicLayout`.

## Project Structure

```
SanTrack_frontend/
├── public/              # Static assets (favicon, images)
├── src/
│   ├── components/      # Reusable UI components (ProtectedRoute, Modal, etc)
│   ├── config/          # Client-side configuration (Axios interceptors)
│   ├── context/         # React Context providers (AuthContext)
│   ├── layouts/         # Layout wrappers (PublicLayout, DashboardLayout, Sidebar)
│   ├── pages/           # Page routes (PublicHome, AdminDashboard, InspectionForm)
│   ├── services/        # API integration wrappers (auth, inspection, issue services)
│   ├── utils/           # Utility functions (cn for tailwind classes, formatting)
│   ├── App.jsx          # Route definitions and entry mapping
│   ├── index.css        # Tailwind directives and global styles
│   └── main.jsx         # React application mount
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind theme, plugins, and color definitions
└── vite.config.js       # Vite configuration
```

## Getting Started

### Prerequisites

*   Node.js (v18+ recommended)
*   SanTrack Backend server running locally or hosted for API requests.

### Setup & Installation

1.  **Navigate to the frontend directory:**
    ```bash
    cd SanTrack_frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    By default, the Vite proxy configuration connects local API calls directly to `http://localhost:5000`. You can change the backend URL in `src/config/axios.js` for production deployments.

### Running the App

**Start Development Server:**
```bash
npm run dev
```

The application will be served locally, typically at `http://localhost:5173`. Open your browser to view it.

**Build for Production:**
```bash
npm run build
```
This generates optimized static files into a `dist/` directory ready for deployment on platforms like Vercel, Netlify, or Nginx.
