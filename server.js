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

// Our DataBase.
const dataBase = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0, // This variable will increment when a user submits a image URL.
      joined: new Date()
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date()
    }
  ],

  // This id will be incremented when a new user is registred.
  ids: 124
};

// Cors package is used for trust, so Google Chrome will trust in this server
// and will not throw an error when this server gives to him a response.
app.use(cors());
// Middlewares for translate data from client.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===========================
        ROUTE DEFINITIONS
============================== */

app.get("/", (req, res) => {
  res.json(dataBase.users);
});

// Signin Route.
app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  // Search for the user in the database based on the provided email.
  const user = dataBase.users.find((user) => user.email === email);

  bcrypt.compare(
    password,
    "$2b$10$hc1E0Lv566h4Egz4b.nRZeTzi93DfQLaPePwhfoEnJLReN2bwsCeq",
    function (err, result) {
      if (result) {
        console.log("hash-ul corespunde cu parola ta", result);
      } else {
        console.log("hash-ul NU corespunde cu parola ta", result);
      }
    }
  );

  if (user) {
    // If the user is found, check if the provided password matches.
    if (password === user.password) {
      res.json(dataBase.users[0]);
    } else {
      res.status(400).json("error logging in: invalid user/password");
    }
  } else {
    res.status(400).json("error logging in: invalid user/password");
  }
});

// Register Route.
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  db("users")
    // ceea ce pui ca si parametru in aceasta metoda de returning,
    // va fi returnat de o instructiune de: insert, update sau delete
    .returning("*")
    .insert({ name: name, email: email, joined: new Date() })
    .then((respons) => {
      res.json(respons[0]);
    })
    .catch((err) => {
      res.status(400).send("Unnable to register !");
    });
});

// Profile Route.
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let userFound = false;

  dataBase.users.forEach((user) => {
    if (user.id === id) {
      userFound = true;
      res.json(user);
    }
  });

  if (!userFound) {
    res.status(400).json("User not found");
  }
});

// Image Route.
app.put("/image", (req, res) => {
  const { id } = req.body;

  let userFound = false;

  dataBase.users.forEach((user) => {
    if (user.id === id) {
      userFound = true;
      user.entries++;
      res.json(user.entries);
    }
  });

  if (!userFound) {
    res.status(400).json("User not found");
  }
});

app.listen(3000, () => {
  console.log("Server is running");
});
