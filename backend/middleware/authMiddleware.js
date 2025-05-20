const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès non autorisé" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded; // ✅ Correction : Ajouter les infos de l'utilisateur au req.user
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token invalide" });
  }
};

module.exports = authMiddleware;
