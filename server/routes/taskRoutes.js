import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/autMiddleware.js";

const router = express.Router();

//GET  obtener tares
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId }).sort({
      order: 1,
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las tareas" });
  }
});

//POST Crear nueva tarea
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text, completed } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "El texto es obligatorio" });
    }
    const tasksCount = await Task.countDocuments({ user: req.user.userId });

    const newTask = new Task({
      text,
      completed: completed || false,
      user: req.user.userId,
      order: tasksCount,
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Error al crear tarea" });
  }
});
router.patch("/reorder", authMiddleware, async (req, res) => {
  try {
    const { tasks } = req.body;
    for (let i = 0; i < tasks.length; i++) {
      await Task.findOneAndUpdate(
        { _id: tasks[i]._id, user: req.user.userId },
        { order: i },
      );
    }
    res.json({ message: "Orden actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al ordenar tareas" });
  }
});
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const updateTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { returnDocument: "after" },
    );
    if (!updateTask) {
      return res.status(404).json({
        message: "Tarea no encontrada",
      });
    }
    res.json(updateTask);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar tarea" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!deletedTask) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la tarea" });
  }
});

export default router;
