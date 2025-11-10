# Trip Cherry - Travel Management System

A modern travel management application built with React, TypeScript, Vite, and Material Tailwind.

## Features

- 🔐 Mock authentication with login screen
- 📊 Dashboard with sidebar navigation
- ✈️ Flight management (coming soon)
- 📅 Booking management (coming soon)
- 🎨 Responsive design with Material Tailwind
- ⚡ Fast development with Vite
- 📱 Mobile-friendly interface

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Build tool
- **Material Tailwind** - Component library
- **React Router DOM 7** - Routing
- **Tailwind CSS** - Styling
- **Heroicons** - Icons

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+

### Installation

\`\`\`bash
cd trip-cherry
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

### Build

\`\`\`bash
npm run build
\`\`\`

## Project Structure

\`\`\`
trip-cherry/
├── src/
│   ├── layouts/
│   │   └── Dashboard.tsx          # Main dashboard layout
│   ├── pages/
│   │   ├── auth/
│   │   │   └── SignIn.tsx         # Login page
│   │   └── dashboard/
│   │       ├── Bookings.tsx       # Bookings page
│   │       └── Flights.tsx        # Flights page
│   ├── widgets/
│   │   └── layout/
│   │       ├── Navbar.tsx         # Top navigation
│   │       └── Sidebar.tsx        # Left sidebar
│   ├── App.tsx                    # Root component with routes
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
\`\`\`

## Usage

1. **Login**: Navigate to the app and you'll see the login screen. Enter any credentials to proceed to the dashboard.

2. **Dashboard**: After login, you'll be redirected to the Bookings page by default.

3. **Navigation**: Use the left sidebar to switch between Bookings and Flights pages.

## License

MIT
