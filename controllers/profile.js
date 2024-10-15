const handleProfile = (req, res, db) => {
  const userId = req.user.userId; // Obține userId-ul din token

  // Interogare a bazei de date folosind db.select
  db.select("*")
    .from("users")
    .where("id", "=", userId)
    .then((user) => {
      if (user.length === 0) {
        return res
          .status(404)
          .json({ message: "Utilizatorul nu a fost găsit" });
      }

      // Trimite datele actualizate despre utilizator
      res.json({
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        entries: user[0].entries,
        joined: user[0].joined
      });
    })
    .catch((error) => {
      // Gestionarea erorilor
      res.status(500).json({ message: "Eroare de server", error });
    });
};

module.exports = {
  handleProfile: handleProfile
};
