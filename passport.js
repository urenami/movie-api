const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

const Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

const jwtSecret = process.env.JWT_SECRET;

// Debug log to check if JWT_SECRET is loaded
console.log("JWT_SECRET in passport.js:", jwtSecret ? "Loaded " : " Missing!");

// LocalStrategy for username/password login
passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    (username, password, callback) => {
      console.log("Login attempt:", username, password);
      Users.findOne({ Username: username }, (error, user) => {
        if (error) {
          console.error("LocalStrategy error:", error);
          return callback(error);
        }

        if (user && user.validatePassword(password)) {
          console.log("Login successful for:", username);
          return callback(null, user);
        } else {
          console.log("Incorrect username or password for:", username);
          return callback(null, false, {
            message: "Incorrect username or password.",
          });
        }
      });
    }
  )
);

// JWT Strategy for protecting endpoints
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    },
    (jwtPayload, callback) => {
      console.log("JWT payload received:", jwtPayload);
      return Users.findById(jwtPayload._id)
        .then((user) => {
          if (user) {
            console.log("JWT validated for:", user.Username);
          } else {
            console.log("JWT user not found:", jwtPayload._id);
          }
          return callback(null, user);
        })
        .catch((error) => {
          console.error("JWTStrategy error:", error);
          return callback(error);
        });
    }
  )
);
