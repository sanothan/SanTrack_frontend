# SanTrack Frontend

A comprehensive React frontend application for the SanTrack Rural Sanitation Inspection and Improvement System.

## Features

- **Role-Based Access Control**: Admin, Inspector, and Community Leader roles
- **Dashboard**: Role-based dashboards with analytics and insights
- **User Management**: Complete CRUD operations for system users
- **Village Management**: Track villages, districts, and populations
- **Facility Management**: Monitor sanitation facilities with geospatial data
- **Inspection System**: Schedule and track facility inspections with scoring
- **Issue Reporting**: Community-driven issue reporting and resolution tracking
- **Analytics & Reports**: Comprehensive analytics with charts and visualizations
- **File Upload**: Image upload support for inspections and issues
- **Responsive Design**: Mobile-first responsive UI with Tailwind CSS

## Tech Stack

- **React 18** with modern hooks and patterns
- **React Router v6** for client-side routing
- **React Query** for server state management and caching
- **React Hook Form** with Zod validation
- **Tailwind CSS** for utility-first styling
- **Lucide React** for beautiful icons
- **Recharts** for data visualization
- **React Hot Toast** for notifications

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── common/          # Shared components
│   │   ├── ProtectedRoute.jsx
│   ├── users/           # User management components
│   ├── villages/        # Village management components
│   ├── inspections/     # Inspection components
│   ├── issues/           # Issue management components
│   └── analytics/       # Analytics components
├── context/             # React context providers
│   └── AuthContext.jsx
├── layouts/              # Layout components
│   ├── Layout.jsx
│   └── AuthLayout.jsx
├── pages/                # Page components
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── UsersPage.jsx
│   ├── VillagesPage.jsx
│   ├── FacilitiesPage.jsx
│   ├── InspectionsPage.jsx
│   ├── IssuesPage.jsx
│   ├── ReportsPage.jsx
│   ├── AnalyticsPage.jsx
│   ├── ProfilePage.jsx
│   ├── SettingsPage.jsx
│   ├── UnauthorizedPage.jsx
│   └── NotFoundPage.jsx
├── services/             # API service layer
│   ├── api.js
│   ├── userService.js
│   ├── villageService.js
│   ├── facilityService.js
│   ├── inspectionService.js
│   ├── issueService.js
│   └── analyticsService.js
└── utils/                # Utility functions
    └── constants.js
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd santrack-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

6. Preview production build:
```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1

# Application Configuration
VITE_APP_NAME=SanTrack
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Rural Sanitation Inspection and Improvement System

# Authentication
VITE_TOKEN_EXPIRE=30d
VITE_PASSWORD_MIN_LENGTH=6

# File Upload
VITE_MAX_FILE_SIZE=5242880
VITE_MAX_FILES=5

# Map Configuration
VITE_DEFAULT_LAT=28.6139
VITE_DEFAULT_LNG=77.2090

# Development
VITE_DEV_MODE=true
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## User Roles and Permissions

### Admin
- Full access to all features
- User management
- Village management
- Analytics and reports
- System configuration

### Inspector
- Facility management
- Inspection management
- Issue management
- View assigned villages
- Create and update inspections

### Community Leader
- Report issues for their village
- View village facilities and issues
- Track issue resolutions
- View inspection results

## Key Features

### Authentication
- JWT-based authentication
- Role-based access control
- Protected routes with authorization
- Login/logout functionality

### Dashboard
- Role-based dashboard views
- Summary cards with key metrics
- Interactive charts and graphs
- Recent activity feeds
- Quick action buttons

### User Management
- Complete CRUD operations
- Role assignment
- Status management
- Search and filtering
- Pagination

### Facility Management
- Geospatial mapping integration
- Facility type categorization
- Condition tracking
- Image upload support
- Inspection history

### Inspection System
- Multi-step inspection forms
- Score-based status determination
- Photo upload with preview
- Recommendation tracking
- Scheduling system

### Issue Reporting
- Community-driven issue reporting
- Severity classification
- Status tracking
- Assignment system
- Resolution workflow
- Photo evidence support

### Analytics
- Real-time dashboard metrics
- Interactive charts and graphs
- Facility condition analysis
- Issue trend tracking
- Performance analytics
- Export capabilities

### UI/UX Features
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Easy on the eyes
- **Accessibility**: WCAG 2.1 compliant
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: Comprehensive error boundaries
- **Toast Notifications**: Non-intrusive feedback
- **Form Validation**: Real-time validation with clear errors
- **Data Tables**: Sortable, filterable, paginated
- **Modals**: Reusable modal components
- **Progress Indicators**: Visual feedback for operations

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
