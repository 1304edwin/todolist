import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    //Validacion
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Usuario y contraseña son obligatorias" });
    }

    //Ver si existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    //Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    //crear Usuario
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: " Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al registra usuario" });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    //validacion
    if (!username || !password) {
      return res.status(400).json({
        message: "Usuario y contraseña son obligatorios",
      });
    }

    //Buscar Usuario
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Credencial invalidas" });
    }

    //Compara Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales invalidas" });
    }

    //Crear token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login correcto",
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al iniciar sesión",
    });
  }
});

export default router;
