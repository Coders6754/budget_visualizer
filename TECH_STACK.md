# Technology Stack - Personal Budget Visualizer

## Frontend Technologies

### Core
- **React.js** (v19.1.0)
  - Modern UI library for building interactive interfaces
  - Efficient component-based architecture
  - Hooks for state management

### UI/UX
- **Tailwind CSS** (v3.4.17)
  - Utility-first CSS framework
  - Responsive design system
  - Custom component styling

- **Framer Motion** (v12.10.5)
  - Animation library
  - Smooth transitions
  - Interactive UI elements

### Data Visualization
- **Chart.js** (v4.4.9)
  - Interactive charts and graphs
  - Financial data visualization
  - Real-time updates
- **React-Chartjs-2** (v5.3.0)
  - React wrapper for Chart.js
  - Seamless chart integration

### State Management & API
- **Axios** (v1.9.0)
  - HTTP client
  - API integration
  - Request/response handling

### User Experience
- **React-Toastify** (v11.0.5)
  - Toast notifications
  - User feedback system
  - Action confirmations

## Backend Technologies

### Core
- **Node.js**
  - JavaScript runtime
  - Server-side operations
  - Asynchronous processing

### Framework
- **Express.js**
  - Web application framework
  - RESTful API endpoints
  - Middleware support

### Database
- **MongoDB**
  - NoSQL database
  - Flexible document schema
  - Scalable data storage

### Middleware & Security
- **CORS**
  - Cross-Origin Resource Sharing
  - Secure API access
  - Domain whitelisting

### Environment & Configuration
- **dotenv**
  - Environment variable management
  - Configuration handling
  - Secure credentials storage

## Development & Testing Tools

### Testing
- **Jest**
  - Unit testing framework
- **React Testing Library**
  - Component testing
  - User interaction testing

### Development Tools
- **nodemon**
  - Auto-server restart
  - Development efficiency
- **PostCSS**
  - CSS processing
  - Style optimization

## Deployment & Hosting

### Frontend Hosting
- **Vercel**
  - Static site hosting
  - Automatic deployments
  - SSL/TLS security

### Backend Hosting
- **Render**
  - Server deployment
  - Continuous integration
  - Scalable hosting

### Database Hosting
- **MongoDB Atlas**
  - Cloud database service
  - Automated backups
  - Database monitoring

## Version Control & Repository
- **Git**
  - Version control system
  - Code management
- **GitHub**
  - Repository hosting
  - Collaboration platform
  - CI/CD integration

## Project Dependencies

### Frontend Dependencies
```json
{
  "dependencies": {
    "@testing-library/dom": "^10.4.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^13.5.0",
    "autoprefixer": "^10.4.21",
    "axios": "^1.9.0",
    "chart.js": "^4.4.9",
    "framer-motion": "^12.10.5",
    "postcss": "^8.5.3",
    "react": "^19.1.0",
    "react-chartjs-2": "^5.3.0",
    "react-dom": "^19.1.0",
    "react-scripts": "5.0.1",
    "react-toastify": "^11.0.5",
    "web-vitals": "^2.1.4"
  }
}
```

### Backend Dependencies
```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "mongoose": "^7.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

## Architecture Overview

```plaintext
Frontend (React.js)
    ↓
    HTTP/API Calls (Axios)
    ↓
Backend (Node.js + Express)
    ↓
Database (MongoDB)
```

This tech stack was chosen for:
- Modern web development practices
- Scalable architecture
- Real-time data handling
- Responsive user interface
- Efficient data visualization
- Secure data management 