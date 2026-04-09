import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // debe venir como: Bearer TOKEN
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // {userId , username}
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o experido" });
  }
};

export default authMiddleware;
