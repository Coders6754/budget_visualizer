const express = require("express");
const cors = require("cors");
const { connection, PORT } = require("./config/db");

const app = express();
app.use(express.json());

// CORS configuration
app.use(cors({
  // Add your Vercel frontend URL here after deployment
  origin: [
    'http://localhost:3000',  // Local development
    'https://finance-budget-frontend.vercel.app'  // Your Vercel frontend URL (update this after deployment)
  ],
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  credentials: true
}));

app.use('/api/transactions', require('./routes/transactions'));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to DataBase");
  } catch (error) {
    console.log(`${error} is giving while connecting`);
  }
  console.log(`Listening on PORT: ${PORT}`);
});

