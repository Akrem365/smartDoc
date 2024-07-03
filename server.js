import express from "express";
import notFoundMiddleare from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";
import authenticateUser from "./middleware/Auth.js";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
dotenv.config();
import "express-async-errors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.use((socket, next) => {
  // Autoriser les connexions
  socket.handshake.headers.origin = "*";
  next();
});

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(express.json());
console.log("hello");

// Activer CORS
app.use(cors({ origin: "http://localhost:3000" }));

//routes
import authRouter from "./routes/authRoute.js";
import PatientRouter from "./routes/PatientRoute.js";
import ParamsVitauxRouter from "./routes/ParamsViatuxRoute.js";
import rendezVousRouter from "./routes/rendezVousRoute.js";
import HistoriqueRoute from "./routes/HistoriqueRoute.js";
import notificationsRoute from "./routes/notificationsRoute.js";
import fs from "fs";
import path from "path";

app.get("/", (req, res) => {
  // throw new Error("error");
  res.json({ msg: "Welcome!" });
});
app.get("/api/v1", (req, res) => {
  res.json({ msg: "API " });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, PatientRouter);
app.use("/api/v1/paramsVitaux", ParamsVitauxRouter);
app.use("/api/v1/rendezVous", rendezVousRouter);
app.use("/api/v1/historique", HistoriqueRoute);
app.use("/api/v1/notifications", notificationsRoute);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
export default io;
