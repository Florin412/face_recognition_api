const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1", // localhost
    port: 5432,
    user: "remus",
    password: "test",
    database: "smart_brain"
  }
});

// This is for bcrypt in order to work.
const saltRounds = 10;

const app = express();

// Cors package is used for trust, so Google Chrome will trust in this server
// and will not throw an error when this server gives to him a response.
app.use(cors());

// Middlewares for translate data from client.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===========================
        ROUTE DEFINITIONS
============================== */

// Signin Route.
app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);

      if (isValid) {
        db.select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => {
            res.status(400).json("Unable to sign in.");
          });
      } else {
        res.status(400).json("Wrong credentials.");
      }
    })
    .catch((err) => {
      res.status(400).json("Wrong credentials.");
    });
});

// Register Route.
app.post("/register", (req, res) => {
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
});

// Profile Route.
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  db.select("*")
    .from("users")
    .where("id", id)
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("User not found");
      }
    })
    .catch((err) => {
      res.status(400).json("Error getting the user.");
    });
});

// Image Route.
app.put("/image", (req, res) => {
  const { id } = req.body;

  return db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      console.log(entries[0]);

      if (entries.length) {
        res.json(entries[0]);
      } else {
        res.status(400).json("Cannot get the entries.");
      }
    })
    .catch((err) => {
      res.status(400).json("Error getting the entries.");
    });
});

app.get("/image", (req, res) => {
  db.select("entries").from("users")
});

app.listen(3000, () => {
  console.log("Server is running");
});
