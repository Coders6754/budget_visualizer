const express = require("express");
const cors = require("cors");
const { connection, PORT } = require("./config/db");

const app = express();
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://budget-visualizer-wpcw.vercel.app'  // Your actual Vercel frontend URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API Routes
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/recurring', require('./routes/recurring'));

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

