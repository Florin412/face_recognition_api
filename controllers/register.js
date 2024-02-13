const handleRegister = (req, res, db, bcrypt, saltRounds) => {
  const { name, email, password } = req.body;

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
        trx("users")
          .returning("*")
          .insert({
            email: logInEmail[0].email,
            name: name,
            joined: new Date()
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("Unable to register."));
};

module.exports = {
  handleRegister: handleRegister
};
