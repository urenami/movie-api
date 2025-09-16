const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let movieSchema = mongoose.Schema(
  {
    Title: { type: String, required: true },
    Description: { type: String },
    Genre: {
      Name: String,
      Description: String,
    },
    Director: {
      Name: String,
      Bio: String,
      BirthYear: String, // standardized field name
    },
    Actors: [String],
    ImageUrl: String,     // consistent name, use ImageUrl everywhere
    Featured: Boolean,
    ReleaseYear: String,  // standardized Year field
  },
  { timestamps: true } // adds createdAt and updatedAt
);

// strip __v in JSON
movieSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

let userSchema = mongoose.Schema(
  {
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  },
  { timestamps: true }
);

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

// strip Password + __v
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.Password;
    delete ret.__v;
    return ret;
  },
});

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;