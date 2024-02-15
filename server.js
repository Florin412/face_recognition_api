const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const image_api_call = require("./controllers/image_api_call");

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB
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

app.post("/imageurl", (req, res) => {
  image_api_call.handleApiCall(req, res);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}.`);
});
