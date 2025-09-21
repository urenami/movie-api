require("dotenv").config();

const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  mongoose = require("mongoose");

// declaring that variable app = deploy express() function
const app = express();

//Validation for app
const { check, validationResult } = require("express-validator");

// use of body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// require CORS
const cors = require("cors");
const allowedOrigins = [
  "https://movie-api.onrender.com",
  "https://ezmyflixapp.netlify.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          "The CORS policy for this application doesn’t allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

// import auth file
let auth = require("./auth")(app);

const passport = require("passport");
require("./passport");

//add schemas to the API
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

console.log("Render MONGO_URI is:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// creating a write stream to go to log.txt
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});
app.use(morgan("common", { stream: accessLogStream }));

// morgan logger, express, body-parser
app.use(express.static("public"));

//READ
app.get("/documentation", (req, res) => {
  console.log("Documentation Request");
  res.sendFile("public/documentation.html", { root: __dirname });
});

// GET requests
app.get("/", (req, res) => {
  res.send("Welcome to myFlix app!");
});

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(200).json(users.map((u) => u.toJSON()));
      })

      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user.toJSON());
      })

      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// GET all movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const movies = await Movies.find();
      res.json(movies.map((m) => m.toJSON())); // strip __v
    } catch (err) {
      console.error("Error fetching movies:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// GET a movie by Title
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const movie = await Movies.findOne({ Title: req.params.Title });
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(movie.toJSON());
    } catch (err) {
      console.error("Error fetching movie:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// GET movies by Genre
app.get(
  "/movies/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const movies = await Movies.find({ "Genre.Name": req.params.genreName });
      res.json(movies.map((m) => m.toJSON()));
    } catch (err) {
      console.error("Error fetching genre movies:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// GET Director info
app.get(
  "/movies/director/:directorName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const movie = await Movies.findOne({
        "Director.Name": req.params.directorName,
      });
      if (!movie) {
        return res.status(404).json({ message: "Director not found" });
      }
      res.json(movie.Director); // return only director field
    } catch (err) {
      console.error("Error fetching director:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

//CREATE
app.post(
  "/users",
  // Validation logic for request
  [
    // Username should be required and should be minimum 5 characters long
    check(
      "Username",
      "Username is required and has to be minimum five characters long"
    ).isLength({ min: 5 }),
    // Username should be only alphanumeric characters
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    // Password is required
    check("Password", "Password is required").not().isEmpty(),
    // Email is required and should be valid
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Add a user to database
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              // strip password before sending response
              let { Password, ...userWithoutPassword } = user.toJSON();
              res.status(201).json(userWithoutPassword);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

app.post(
  "/users/:Username/movies/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $addToSet: { FavoriteMovies: req.params.id } },
      { new: true } // return the updated document
    )
      .then((updatedUser) => {
        res.status(200).json(updatedUser.toJSON());
      })

      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  }
);

//UPDATE
// UPDATE user info (partial updates supported)
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const updateFields = {};

      // Only update fields if provided in request body
      if (req.body.Username) updateFields.Username = req.body.Username;
      if (req.body.Email) updateFields.Email = req.body.Email;
      if (req.body.Birthday) updateFields.Birthday = req.body.Birthday;

      // If password is provided, hash it before saving
      if (req.body.Password) {
        updateFields.Password = Users.hashPassword(req.body.Password);
      }

      const updatedUser = await Users.findOneAndUpdate(
        { Username: req.params.Username },
        { $set: updateFields },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser.toJSON());
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);

//DELETE
app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ message: `${req.params.Username} was not found` });
      }
      return res
        .status(200)
        .json({ message: `${req.params.Username} was deleted.` });
    })
    .catch((err) => {
      console.error("Delete user error:", err);
      res.status(500).json({ error: err.message });
    });
});

app.delete(
  "/users/:Username/movies/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.id } },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(updatedUser.toJSON());
      })
      .catch((error) => {
        console.error("Delete favorite error:", error);
        return res.status(500).json({ error: error.message });
      });
  }
);

//morgan middleware error handling function
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// listens for requests
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listening on Port " + port);
});
