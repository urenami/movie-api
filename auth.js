const jwtSecret = "your_jwt_secret"; // must be same key used in JWTStrategy

const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport"); // Local passport file

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // JWT encoded username
    expiresIn: "7d", // expires 7d
    algorithm: "HS256", // 256 bit encryption
  });
};

/* POST login. */
module.exports = (app) => {
  app.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right: " + error,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          return res.status(400).json({
            message: "Something is not right: " + error,
          });
        }
        let token = generateJWTToken(user.toJSON());

        // 👇 Strip password field before sending back user
        let { Password, ...userWithoutPassword } = user.toJSON();

        return res.json({ user: userWithoutPassword, token });
      });
    })(req, res);
  });
};
