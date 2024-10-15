const jwt = require("jsonwebtoken");

const handleSignIn = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }

  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
           
            // Crearea tokenului JWT
            const token = jwt.sign(
              { userId: user[0].id, email: user[0].email }, // Asigură-te că transmiți userId și email aici
              JWT_SECRET, // Secretul pentru semnarea tokenului
              { expiresIn: "1h" } // Tokenul expiră după o oră
            );

            // Trimite userul si token-ul către client
            res.status(200).json({ user: user[0], token: token });

            
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
};

module.exports = {
  handleSignIn: handleSignIn
};
