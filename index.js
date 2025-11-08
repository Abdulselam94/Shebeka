/** const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Shebeka Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
**/

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testConnection } = require("./db/connection");
const { syncDatabase } = require("./models");
const userRoutes = require("./routes/user");
const jobRoutes = require("./routes/jobs");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/user", userRoutes);
/**app.use("/api/jobs", jobRoutes);**/

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    message: "Job Portal API is running!",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Something went wrong!" });
});

// Initialize server
const initializeServer = async () => {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.log("❌ Server cannot start without database connection");
      process.exit(1);
    }

    // Sync database
    await syncDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ Failed to initialize server:", error);
    process.exit(1);
  }
};

// Start the server
initializeServer();
