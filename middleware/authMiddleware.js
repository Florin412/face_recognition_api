const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const token = req.header("Authorization")?.split(" ")[1]; // Tokenul va fi în header-ul Authorization: Bearer <token>

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acces interzis: Nu există token." });
  }

  try {
    // Variabila decoded contine datele despre utlizatorul tokenului.
    const decoded = jwt.verify(token, JWT_SECRET); // Verifică validitatea token-ului
    req.user = decoded; // Salvează datele utilizatorului în req pentru a fi folosite în alte rute
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid sau expirat." });
  }
};

module.exports = authenticateToken;
