const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

const Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

// Use JWT_SECRET from .env
const jwtSecret = process.env.JWT_SECRET;

passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    (username, password, callback) => {
      console.log(username + "  " + password);
      Users.findOne({ Username: username }, (error, user) => {
        if (error) {
          console.log(error);
          return callback(error);
        }

        if (user && user.validatePassword(password)) {
          console.log("finished");
          return callback(null, user);
        } else {
          console.log("incorrect username or password");
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
      return Users.findById(jwtPayload._id)
        .then((user) => callback(null, user))
        .catch((error) => callback(error));
    }
  )
);
