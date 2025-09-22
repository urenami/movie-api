const jwtSecret = process.env.JWT_SECRET;

const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport");

// Generate JWT Token
let generateJWTToken = (user) => {
  return jwt.sign({ _id: user._id, Username: user.Username }, jwtSecret, {
    subject: user.Username,
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

/* POST login */
module.exports = (app) => {
  app.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Login failed",
          error: error || info?.message || "Invalid credentials",
        });
      }

      req.login(user, { session: false }, (error) => {
        if (error) {
          return res.status(400).json({
            message: "Login process error",
            error,
          });
        }

        let token = generateJWTToken(user.toJSON());

        let { Password, ...userWithoutPassword } = user.toJSON();

        return res.json({ user: userWithoutPassword, token });
      });
    })(req, res);
  });
};
