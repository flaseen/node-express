import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import healthCheck from "./routes/healthcheck.js";
import welcome from "./routes/welcome.js";

const app = express();
const port = process.env.APP_PORT || 3000;

// App Level Middlewares
app.use(cors({ origin: `http://localhost:${port}`, credentials: true })); // Use & Enable CORS for all routes
app.use(express.json()); // Use JSON Body Parser Middleware
app.use(cookieParser()); // Use Cookie Parser Middleware

// API Routes
app.use("/", welcome);
app.use("/api/health", healthCheck);

// 404 handler (must come after routes, before error handler)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Not Found",
    },
  });
});

// Error Handler (must be after all routes)
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || "Internal Server Error",
      ...(isDev && { stack: err.stack }), // include stack trace in dev only
    },
  });
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
