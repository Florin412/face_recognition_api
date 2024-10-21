const jwt = require("jsonwebtoken");

// Funcție pentru verificarea existenței email-ului în baza de date
const checkEmailExists = (db, email) => {
  return db("login")
    .select("email")
    .where("email", email)
    .then((existingUsers) => existingUsers.length > 0);
};

const handleRegister = (req, res, db, bcrypt, saltRounds) => {
  const { name, email, password } = req.body;

  const JWT_SECRET = process.env.JWT_SECRET;

  console.log(name, email, password, JWT_SECRET);

  // Validarea input-ului
  if (!name || !email || !password) {
    return res.status(400).json("Invalid credentials.");
  }

  // Verificăm dacă emailul există deja în baza de date
  checkEmailExists(db, email)
    .then((exists) => {
      if (exists) {
        // Dacă există deja un utilizator cu acest email, returnăm un mesaj de eroare
        return res.status(400).json("Email already exists.");
      }

      // Dacă emailul nu există, continuăm cu înregistrarea
      const hash = bcrypt.hashSync(password, saltRounds);

      db.transaction((trx) => {
        trx
          .insert({
            hash: hash,
            email: email
          })
          .into("login")
          .returning("email")
          .then((logInEmail) => {
            return trx("users")
              .returning("*")
              .insert({
                email: logInEmail[0].email,
                name: name,
                joined: new Date()
              })
              .then((user) => {
                // Crearea tokenului JWT
                const token = jwt.sign(
                  { userId: user[0].id, email: user[0].email }, // Asigură-te că transmiți userId și email aici
                  JWT_SECRET, // Secretul pentru semnarea tokenului
                  { expiresIn: "1h" } // Tokenul expiră după o oră
                );

                console.log({ user: user[0], token: token });
                // Trimite userul si token-ul către client
                res.status(200).json({ user: user[0], token: token });
              });
          })
          .then(trx.commit)
          .catch(trx.rollback);
      }).catch((err) => res.status(400).json("Unable to register."));
    })
    .catch((err) => res.status(400).json("Unable to check email."));
};

module.exports = {
  handleRegister: handleRegister
};
