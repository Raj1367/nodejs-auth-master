import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import Authrouter from "./routes/authRoutes";
import UserRouter from "./routes/userRoutes";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(cookieParser());

// app.get("/health", (req, res) => {
//   try {
//     res.status(200).json({
//       success: true,
//       error: false,
//       message: "ok",
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       error: true,
//       message: error.message || error || "Internal server error",
//     });
//   }
// });

app.use("/api", Authrouter);
app.use("/api",UserRouter)

export default app;
