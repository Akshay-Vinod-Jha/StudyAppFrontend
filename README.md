# Study Buddy App - Frontend

React-based frontend application for the Study Buddy App, built with Vite for fast development and optimized production builds.

## 📋 Overview

The frontend is a modern React application that provides an intuitive interface for managing study sessions, subjects, notes, and analytics. It features a responsive design, theme switching, and real-time data visualization.

## 🛠️ Technology Stack

- **React 19.2.0** - UI library
- **Vite 5.4.11** - Build tool and dev server
- **React Router DOM 7.13.0** - Client-side routing
- **Axios 1.13.4** - HTTP client for API calls
- **Chart.js 4.5.1** - Data visualization
- **React-ChartJS-2 5.3.1** - React wrapper for Chart.js

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- Running backend server (see backend/README.md)

### Installation

1. **Navigate to the frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   Or if you're using yarn:

   ```bash
   yarn install
   ```

3. **Configure environment variables**

   Create a `.env` file in the frontend directory:

   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

   Adjust the API base URL if your backend runs on a different host/port.

### Running the Development Server

Start the Vite development server:

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The application will be available at:

- **Local**: http://localhost:5173
- **Network**: http://[your-ip]:5173

The dev server features:

- ⚡ Hot Module Replacement (HMR)
- 🔄 Fast refresh
- 🚀 Instant server start

### Building for Production

Create an optimized production build:

```bash
npm run build
```

Or with yarn:

```bash
yarn build
```

The build output will be in the `dist/` directory.

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

Or with yarn:

```bash
yarn preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

Or with yarn:

```bash
yarn lint
```

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable components
│   │   ├── AnimatedNumber.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── SkeletonLoader.jsx
│   │   └── Toast.jsx
│   ├── context/           # React context providers
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── ToastContext.jsx
│   ├── hooks/             # Custom React hooks
│   │   └── useCountUp.js
│   ├── pages/             # Page components
│   │   ├── Analytics.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Notes.jsx
│   │   ├── Subjects.jsx
│   │   └── Tracker.jsx
│   ├── services/          # API service layer
│   │   └── api.js
│   ├── styles/            # CSS stylesheets
│   │   ├── variables.css  # CSS custom properties
│   │   └── [component].css
│   ├── App.jsx            # Main app component
│   ├── App.css            # Global app styles
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🎨 Features

### Pages

- **Login**: User authentication
- **Dashboard**: Overview of study statistics
- **Subjects**: Manage study subjects
- **Notes**: Create and organize notes
- **Tracker**: Log study sessions
- **Analytics**: Visualize study data with charts

### Components

- **Navbar**: Navigation bar with theme toggle
- **ProtectedRoute**: Authentication guard for routes
- **Toast**: Notification system
- **LoadingSpinner**: Loading indicator
- **SkeletonLoader**: Content placeholder during loading
- **AnimatedNumber**: Animated number counter

### Context Providers

- **AuthContext**: User authentication state
- **ThemeContext**: Light/dark theme management
- **ToastContext**: Global notification system

## 🔧 Configuration

### Vite Configuration

The `vite.config.js` file includes React plugin configuration. Customize as needed for your environment.

### ESLint Configuration

ESLint is configured in `eslint.config.js` with React-specific rules.

## 🌐 API Integration

The frontend communicates with the backend API through the `services/api.js` module. All API calls are made using Axios with the base URL configured via environment variables.

### API Endpoints Used

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create new subject
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create new note
- `GET /api/study-logs` - Get study logs
- `POST /api/study-logs` - Create study log
- `GET /api/analytics/*` - Get analytics data

## 🎨 Theming

The app supports light and dark themes. Theme variables are defined in `styles/variables.css` and can be customized:

```css
:root {
  /* Light theme variables */
}

[data-theme="dark"] {
  /* Dark theme variables */
}
```

## 📱 Responsive Design

The application is fully responsive and works on:

- 📱 Mobile devices (320px and up)
- 📱 Tablets (768px and up)
- 💻 Desktops (1024px and up)
- 🖥️ Large screens (1440px and up)

## 🐛 Troubleshooting

### Port already in use

If port 5173 is already in use, Vite will automatically try the next available port. You can also specify a custom port:

```bash
npm run dev -- --port 3000
```

### API connection issues

- Ensure the backend server is running
- Check the `VITE_API_BASE_URL` in your `.env` file
- Verify CORS settings in the backend configuration

### Build errors

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📄 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔗 Related Documentation

- [Main Project README](../README.md)
- [Backend README](../backend/README.md)
- [Design System](./DESIGN_SYSTEM.md)

## 📦 Dependencies

### Production Dependencies

```json
{
  "axios": "^1.13.4",
  "chart.js": "^4.5.1",
  "react": "^19.2.0",
  "react-chartjs-2": "^5.3.1",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.13.0"
}
```

### Development Dependencies

```json
{
  "@vitejs/plugin-react": "^4.3.4",
  "eslint": "^9.39.1",
  "vite": "^5.4.11"
}
```

## 👨‍💻 Development Tips

1. **Use React DevTools** - Install the React DevTools browser extension for debugging
2. **Hot Reload** - Vite's HMR preserves component state during development
3. **Component Organization** - Keep components small and focused on a single responsibility
4. **API Service** - All API calls go through `services/api.js` for consistency
5. **Context Usage** - Use context for global state (auth, theme, toast)

## 🚀 Performance Optimization

- Code splitting with React.lazy (if needed)
- Vite's automatic chunk optimization
- CSS purging in production builds
- Optimized asset loading

---

For questions or issues, please refer to the main project documentation or create an issue in the repository.
