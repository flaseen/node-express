import express from "express";
import { helloWorld } from "../controllers/welcome.js";

const router = express.Router();

router.get("/", helloWorld);

export default router;
