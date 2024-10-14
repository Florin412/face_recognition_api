const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const image_api_call = require("./controllers/image_api_call");
const path = require("path");
const favicon = require("serve-favicon"); // Add this line to import the favicon module
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/authMiddleware");

// Below are imported sensitive data from a configuration file (.env), just for development.
// In production, configure env variables from your hosting platform, with the same name as below.
require("dotenv").config();

// Below you can see the db client for production mode

// const db = knex({
//   client: "pg",
//   connection: {
//     connectionString: process.env.DB_URL,
//     ssl: { rejectUnauthorized: false },
//     host: process.env.DB_HOST,
//     port: 5432,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME
//   }
// });

// Below you can see the db client for development mode.
// You should comment this on production.

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST, // The IP address for localhost
    port: process.env.DB_PORT, // The default port for PostgreSQL
    user: process.env.DB_USER, // The PostgreSQL username
    password: process.env.DB_PASS, // The password for the PostgreSQL user
    database: process.env.DB_NAME // The name of the database
  }
});

// Connection test for the database
db.raw("SELECT 1")
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

// This is for bcrypt in order to work.
const saltRounds = 10;

const app = express();

// Serve the favicon
app.use(favicon(path.join(__dirname, "favicon.png")));

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

app.get("/profile", authenticateToken, (req, res) => {
  profile.handleProfile(req, res, db);
});

// Image Route.
app.put("/image", authenticateToken, (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", authenticateToken, (req, res) => {
  image_api_call.handleApiCall(req, res);
});

// Ruta pentru verificarea tokenului
app.post("/verify-token", authenticateToken, (req, res) => {
  // Dacă middleware-ul trece, tokenul este valid
  res.json({ valid: true, user: req.user }); // Poți trimite și datele utilizatorului dacă dorești
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is listening on port ${process.env.SERVER_PORT}.`);
});
