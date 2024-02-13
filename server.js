const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

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

app.get("/", (req, res) => {
  res.json("server working.");
});

// Signin Route.
app.post("/signin", (req, res) => {
  signin.handleSignIn(req, res, db, bcrypt);
});

// Register Route.
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt, saltRounds);
});

// Profile Route.
app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db);
});

// Image Route.
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.listen(3000, () => {
  console.log("Server is running");
});
