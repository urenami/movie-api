const express = require('express'),
        morgan = require('morgan'),  
        fs = require('fs'),
        path = require('path'),
        uuid = require('uuid'),
        bodyParser = require('body-parser');
        const mongoose = require('mongoose');
       
// declaring that variable app = deploy express() function
const app = express();

// use of body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// import auth file
let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

//add schemas to the API        
const Models = require('./models.js')

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

// creating a write stream to go to log.txt
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })
app.use(morgan('common', {stream: accessLogStream}));

// morgan logger, express, body-parser
app.use(express.static('public'));

//READ
app.get('/documentation', (req, res) => {                  
        console.log('Documentation Request');
        res.sendFile('public/documentation.html', {root: __dirname});
      });

// GET requests
app.get('/', (req, res) => {
  console.log('Welcome to myFlix app!');     
  res.send('Welcome to myFlix app!');
});

app.get('/users', (req, res) =>  {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
        Movies.find({ Movies: req.params.Movies })
        .then((movies) => {
          res.json(movies);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
});

//get request to get info on movie using title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
        Movies.findOne({ Title: req.params.Title })
        .then((movies) => {
          res.json(movies);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
});

//get request to get genre of a movie
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
        Movies.find({ 'Genre.Name': req.params.genreName })
        .then((movies) => {
          res.json(movies);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), (req,res)=>{
        Movies.findOne({ 'Director.Name': req.params.directorName })
        .then((movies) => {
          res.json(movies.Director);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
});

//CREATE
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

app.post('/users/:Username/movies/:id', passport.authenticate('jwt', { session: false }), (req,res)=> {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
          $addToSet: { FavoriteMovies: req.params.id }},
          req.body,
          { new: true })
          .then((updatedUser) => {
            res.status(200).json(updatedUser);
          })
          .catch(error => {
            res.status(500).json({ error: error.message });
       });
});

      //UPDATE
      app.put('/users/:Username',  passport.authenticate('jwt', { session: false }), (req, res)=> {
        Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
                {
                  Username: req.body.Username,
                  Password: req.body.Password,
                  Email: req.body.Email,
                  Birthday: req.body.Birthday
                }
              },
              { new: true })
              .then((updatedUser) => {
                res.status(200).json(updatedUser);
              })
              .catch(error => {
                res.status(500).json({ error: error.message });
          });      
      });
      
      
      
      //DELETE
      app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req,res)=>{
        Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
      });
      
      app.delete('/users/:Username/movies/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
        Users.findOneAndUpdate({ Username: req.params.Username }, {
                $pull: { FavoriteMovies: req.params.id }},
                req.body,
                { new: true })
                .then((updatedUser) => {
                res.status(200).json(updatedUser);
                })
                .catch(error => {
                res.status(500).json({ error: error.message });
             });
});

//morgan middleware error handling function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('error');
  });

// port 8080 listens for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});