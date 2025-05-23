# Personal Budget Visualizer

A full-stack web application for tracking personal finances and visualizing budget data.

## About

The Personal Budget Visualizer is a modern, user-friendly financial management application designed to help users take control of their finances. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), this application offers a comprehensive solution for tracking both income and expenses while providing insightful visualizations of spending patterns.

### Key Highlights

- **Intuitive Interface**: Clean and modern design that makes financial tracking enjoyable
- **Real-time Updates**: Instantly see how your transactions affect your overall budget
- **Visual Analytics**: Beautiful charts and graphs that help you understand your spending habits
- **Category Management**: Organize transactions with customizable categories
- **Responsive Design**: Seamlessly works on desktop, tablet, and mobile devices

### Purpose

This project was developed to address the common challenge of personal finance management by providing:
- Simple and efficient transaction tracking
- Visual representation of financial data
- Easy categorization of income and expenses
- Quick insights into spending patterns
- Secure and reliable data storage

### Target Users
- Individuals looking to track personal expenses
- Small business owners managing cash flow
- Students managing their budget
- Anyone interested in visualizing their financial habits

## Live Demo

- Frontend: [https://budget-visualizer-wpcw.vercel.app](https://budget-visualizer-wpcw.vercel.app)
- Backend: [https://finance-budget-backend.onrender.com](https://finance-budget-backend.onrender.com)

## Features

- 💰 Track income and expenses
- 📊 Visual data representation with charts
- 🔍 Categorize transactions
- 📱 Responsive design for all devices
- ⚡ Real-time updates
- 🌐 Cloud-hosted solution

## Tech Stack

### Frontend
- React.js
- Chart.js for data visualization
- Tailwind CSS for styling
- Axios for API requests
- React-Toastify for notifications
- Framer Motion for animations

### Backend
- Node.js
- Express.js
- MongoDB for database
- CORS for secure cross-origin requests

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Coders6754/budget_visualizer.git
   cd budget_visualizer
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Backend (.env):
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_uri
     ```
   - Frontend (.env):
     ```
     REACT_APP_API_URL=http://localhost:5000
     ```

4. Run the application:
   ```bash
   # Run backend (from server directory)
   npm start

   # Run frontend (from client directory)
   npm start
   ```

## Deployment

- Frontend is deployed on [Vercel](https://vercel.com)
- Backend is deployed on [Render](https://render.com)
- Database is hosted on [MongoDB Atlas](https://www.mongodb.com/atlas)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
