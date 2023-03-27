const express = require('express');

//import morgan
morgan = require('morgan');

// declaring that variable app = deploy express() function
const app = express();
fs = require('fs');
path = require('path');

// creating a write stream to go to log.txt
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

//use request
app.use(express.static('public'));

//My top 10 Movies
let topMovies = [
  {
    title: 'The Dark Knight',
    director: 'Christopher Nolan'
  },
  {
    title: 'The Dark Knight Rises',
    director: 'Christopher Nolan'
  },
  {
    title: 'Coming to America',
    director: 'John Landis'
  },
  {
    title: 'Trading Places',
    director: 'John Landis'
  },
  {
    title: 'Thor',
    director: 'Kenneth Branagh'
  },
  {
    title: 'The Avengers',
    director: 'Joss Whedon'
  },
  {
    title: 'Avengers: Infinity War',
    director: 'Anthony Russo, Joe Russo'
  },
  {
    title: 'Avengers: End Game ',
    director: 'Anthony Russo, Joe Russo'
  },
  {
    title: 'Lucky Number Slevin',
    director: 'Paul McGuigan'
  },
  {
    title: 'Scarface',
    director: 'Anthony Russo, Joe Russo'
  },
];

//set up logger with morgan
app.use(morgan('common', { stream: accessLogStream }));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix app!');
});

app.get('/movies', (req, res) => {
  res.json(topMovie);
});

//morgan middleware error handling function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('error');
  });

// port 8080 listens for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});