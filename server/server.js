import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

//Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://todolist-beei.onrender.com",
      "https://todolist-jox3fwq7x-1304edwins-projects.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());

//Rutas de tareas
app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);

//Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

//Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
