import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import healthCheck from "./routes/healthcheck.js";
import welcome from "./routes/welcome.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: ".env", debug: process.env.NODE_ENV === "development" });

// Initialize Express app
const app = express();

// Configuration variables
const port = process.env.APP_PORT || 3000;
const allowedOrigins = process.env.CLIENT_ORIGINS.split(",");
const apiVersion = process.env.API_VERSION || "v1";

// App Level Middlewares
app.use(helmet()); // Secure HTTP headers
app.use(morgan("dev")); // HTTP request logger middleware
app.use(express.json({ limit: "100mb" })); // Use JSON Body Parser Middleware
app.use(express.urlencoded({ limit: "100mb", extended: true })); // x-www-form-urlencoded Body Parser Middleware
app.use(cookieParser()); // Use Cookie Parser Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // mobile apps, curl, Postman
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true); // allow other third-party clients
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Create a router for API versioning
const apiRouter = express.Router();

// API Routes
apiRouter.use("/", welcome);
apiRouter.use("/health", healthCheck);

// Prefix all routes with /api/v1
app.use(`/api/${apiVersion}`, apiRouter);

// 404 handler (must come after routes, before error handler)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `${req.originalUrl} not found`,
  });
});

// Error Handler (must be after all routes)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    statusCode: err.status || 500,
    message: err.message || "Internal Server Error",
  });
});

let server;

// Start server
server = app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  try {
    if (server) {
      server.close(() => console.log("HTTP server closed."));
    }

    // Close DB connections if any
    // await prisma.$disconnect();
    // console.log("Database connection closed.");

    console.log("Cleanup complete. Exiting now.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }

  setTimeout(() => {
    console.error("Force shutting down after timeout.");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
