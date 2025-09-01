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

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
