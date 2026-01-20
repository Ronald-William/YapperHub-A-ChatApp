import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import testRoutes from "./routes/test.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/test", testRoutes);

app.use(errorMiddleware);

export default app;
