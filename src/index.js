import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import healthCheck from "./routes/healthcheck.js"; // Importing the test routes
import welcome from "./routes/welcome.js"; // Importing the welcome routes

const app = express();
const port = process.env.APP_PORT || 3000;

// App Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Use & Enable CORS for all routes
app.use(express.json()); // Use JSON Body Parser Middleware
app.use(cookieParser()); // Use Cookie Parser Middleware

// API Routes
app.use('/', welcome);
app.use('/api/health', healthCheck);
// END of API Routes

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
