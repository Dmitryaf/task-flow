import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/auth";
import tasksRouter from "./routes/tasks";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Роуты

app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
