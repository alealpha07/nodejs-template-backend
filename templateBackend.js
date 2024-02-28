const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const conn = require("./connection")
const methodOverride = require('method-override')
const app = express();
require("dotenv").config();
//----------------------------------------- END OF IMPORTS---------------------------------------------------

// Passport Config
const initializePassport = require('./passportConfig')
initializePassport(
  passport,
  conn
)

// Middleware
app.use(cors({
  origin: [process.env.FRONT_END_URL],
  credentials: true,
}));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(session({
  secret: "secretcode",
  resave: false,
  saveUninitialized: false
}))
app.use(methodOverride('_method'))
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

// Authentication Routes
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.status(401).send(info);
    else {
      req.logIn(user, (err) => {
        conn.query(`SELECT * FROM Users WHERE Id = ?`, [req.user.Id], (err, result) => {
          if (err) throw err;
          res.send(result);
        });
      });
    }
  })(req, res, next);
});
app.post("/register", (req, res) => {
  conn.query('SELECT COUNT(Id) as Count FROM Users WHERE Username = ?', [req.body.username], async (err, result) => {
    if (err) throw err;
    if (result[0].Count > 0) {
      res.status(422).send("User Already Exists");
    }
    else {
      if (req.body.password == req.body.confirmPassword) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        conn.query('INSERT INTO Users (Username, Password) VALUES (?,?)', [req.body.username, hashedPassword], (err, result) => {
          if (err) throw err;
          res.send("User Created successfully");
        });
      }
      else {
        res.status(422).send("Passwords must match");
      }
    }
  });
});
app.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    conn.query(`SELECT * FROM Users WHERE Id = ?`, [req.user.Id], (err, result) => {
      if (err) throw err;
      res.send({Login: req.user, Users: result});
    });
  }
  else {
    res.status(401).send('User Not Authenticated!');
  }
});
app.post('/logout', (req, res) => {
  req.logOut();
  res.send('logged out');
});

// Api Imports
app.use('/api/user', require('./routes/api/user'));

//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server Has Started on http://localhost:${port}`);
});