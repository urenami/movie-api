const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

const Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

const jwtSecret = process.env.JWT_SECRET;

passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    (username, password, callback) => {
      console.log("[LocalStrategy] Attempting login:", username);
      Users.findOne({ Username: username }, (error, user) => {
        if (error) {
          console.error("[LocalStrategy] Error:", error);
          return callback(error);
        }

        if (user && user.validatePassword(password)) {
          console.log("[LocalStrategy]  Login successful for", username);
          return callback(null, user);
        } else {
          console.warn("[LocalStrategy] Invalid login for", username);
          return callback(null, false, {
            message: "Incorrect username or password.",
          });
        }
      });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    },
    (jwtPayload, callback) => {
      console.log("[JWTStrategy] 🔑 Received JWT payload:", jwtPayload);

      return Users.findById(jwtPayload._id)
        .then((user) => {
          if (!user) {
            console.warn(
              "[JWTStrategy]  No user found with ID:",
              jwtPayload._id
            );
            return callback(null, false);
          }
          console.log("[JWTStrategy]  User authenticated:", user.Username);
          return callback(null, user);
        })
        .catch((error) => {
          console.error("[JWTStrategy] Error:", error);
          return callback(error);
        });
    }
  )
);
