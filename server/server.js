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
app.use(cors());
app.use(express.json());

//Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

//Rutas de tareas
app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);

//Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
