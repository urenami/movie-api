const express = require('express');

//import morgan
morgan = require('morgan');
bodyParser = require('body-parser'),
uuid = require('uuid');

// declaring that variable app = deploy express() function
const app = express();
fs = require('fs');
path = require('path');

// creating a write stream to go to log.txt
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

//use request
app.use(express.static('public'));

app.use(bodyParser.json());

//My top 10 Movies
let topMovies = [
  { 
    id: 1,
          title: 'The Dark Knight',
          description: 'The Batman, police lieutenant James Gordon, and district attorney Harvey Dent, who form an alliance to dismantle organized crime in Gotham City.' ,
          Genre:
    {
            name: 'Action',
            description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
    },
          director:
    {
            name: 'Christopher Nolan',
            bio: 'Christopher Edward Nolan CBE is a British-American filmmaker. Known for his Hollywood blockbusters with complex storytelling. Nolan is considered a leading filmmaker of the 21st century.' ,
            birthyear: '1970'
    },
            imageUrl:'https://www.imdb.com/title/tt0468569/mediaviewer/rm4023877632/?ref_=tt_ov_i',
            year: '2008'
  },

  { 
    id: 2,
          title: 'The Dark Knight Rises',
          description: 'The revolutionary Bane forces Bruce Wayne to resume his role as Batman and save Gotham City from nuclear destruction.' ,
          Genre:
    {
            name: 'Action',
            description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.' 
    },
          director:
    {
            name: 'Christopher Nolan',
            bio: 'Christopher Edward Nolan CBE is a British-American filmmaker. Known for his Hollywood blockbusters with complex storytelling. Nolan is considered a leading filmmaker of the 21st century.' ,
            birthyear: '1970'
    },
            imageUrl:'https://www.imdb.com/title/tt1345836/mediaviewer/rm834516224/?ref_=tt_ov_i',
            year: '2012'
  },  
  {
    id: 3,
          title: 'Coming to America',
          description: 'The crown prince of the fictional African nation of Zamunda, who travels to the United States in the hopes of finding a woman he can marry and love for who she is, not for her status or for having been trained to please him.' ,
          Genre:
    {
            name: 'Comedy',
            escription: 'Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter.' ,
    },
          director: 
    {
            name: 'John Landis',
            bio: 'John David Landis is an American comedy, horror, and fantasy filmmaker and actor. He is best known for the comedy films that he has directed.' ,
            birthyear: '1970'
    },
            imageUrl: 'https://www.imdb.com/title/tt0094898/mediaviewer/rm2778142208/?ref_=tt_ov_i',
            year: '1988'
  },
  {
    id: 4,
          title: 'Trading Places',
          description: 'The story of an upper-class commodities broker (Aykroyd) and a poor street hustler (Murphy) whose lives cross when they are unwittingly made the subject of an elaborate bet to test how each man will perform when their life circumstances are swapped.',
          Genre:
    {
          name: 'Comedy',
          description: 'Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter.',
    },      
          director: 
    {
            name: 'John Landis',
            bio: 'John David Landis is an American comedy, horror, and fantasy filmmaker and actor. He is best known for the comedy films that he has directed.' ,
            birthyear: '1970'
    },
            imageUrl:'https://www.imdb.com/title/tt0086465/mediaviewer/rm3049141505/?ref_=tt_ov_i',
            year:'1983'
  },
  {
    id: 5,
          title: 'Thor',
          description: 'After reigniting a dormant war, Thor is banished from Asgard to Earth, stripped of his powers and his hammer. As his brother Loki (Hiddleston) plots to take the Asgardian throne, Thor must prove himself worthy.',
          Genre:
    {
          name: 'Action',
          description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
    },
          director:
    {
            name: 'Kenneth Branagh',
            bio: 'Joseph Hill Whedon is an American filmmaker, composer, and comic book writer. He is the founder of Mutant Enemy Productions, co-founder of Bellwether Pictures, and is best known as the creator of several television series.' ,
            birthyear: '1960'
    },
            imageUrl: 'https://www.imdb.com/title/tt0800369/mediaviewer/rm3272546304/?ref_=tt_ov_i',
            year: '2011'
  },
  {
    id: 6,
            title: 'The Avengers',
            description: 'Nick Fury and the spy agency S.H.I.E.L.D. recruit Tony Stark, Steve Rogers, Bruce Banner, Thor, Natasha Romanoff, and Clint Barton to form a team capable of stopping Thors brother Loki from subjugating Earth.',
            Genre:
    {
            name: 'Action',
            description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
    },
          director: 
    {
            name: 'Joss Whedon',
            bio: 'John David Landis is an American comedy, horror, and fantasy filmmaker and actor. He is best known for the comedy films that he has directed.' ,
            birthyear: '1964'
    },
            imageUrl: 'https://www.imdb.com/title/tt0848228/mediaviewer/rm3955117056/?ref_=tt_ov_i',
            year: '2012'
  },
  {
    id: 7,
          title: 'Avengers: Infinity War',
          description: 'The Avengers and the Guardians of the Galaxy attempt to prevent Thanos from collecting the six all-powerful Infinity Stones as part of his quest to kill half of all life in the universe.',
          Genre:
    {
            name: 'Action',
            description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
    },      
          director: 
    {
            name: 'Anthony Russo, Joe Russo',
            bio: 'Anthony Russo and Joseph Russo, collectively known as the Russo brothers, are American directors, producers, and screenwriters. They direct most of their work together. They are best known for directing four films in the Marvel Cinematic Universe.' ,
            birthyear: '1970, 1971'
    },
            imageUrl: 'https://www.imdb.com/title/tt4154756/mediaviewer/rm4044245504/?ref_=tt_ov_i',
            year: '2018'
  },
  {
    id: 8,
          title: 'Avengers: End Game ',
          description: 'The surviving members of the Avengers and their allies attempt to reverse Thanos actions in Infinity War.',
          Genre:
    {
            name: 'Action',
            description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
    },      
          director: 
    {
            name: 'Anthony Russo, Joe Russo',
            bio: 'Anthony Russo and Joseph Russo, collectively known as the Russo brothers, are American directors, producers, and screenwriters. They direct most of their work together. They are best known for directing four films in the Marvel Cinematic Universe.' ,
            birthyear: '1970, 1971'
    },
            imageUrl: 'https://www.imdb.com/title/tt4154796/mediaviewer/rm2775147008/?ref_=tt_ov_i',
            year: '2019'       
  },
  {
    id: 9,
          title: 'Lucky Number Slevin',
          description: 'Revolves around an innocent man dragged into the middle of a war being plotted by two of New York Citys rival crime bosses.',
          Genre:
    {
            name: 'Crime',
            description: 'Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre.',
    },      
          director: 
    {
            name: 'Paul McGuigan',
            bio: 'Paul McGuigan is a Scottish film and television director, best known for directing films such as Lucky Number Slevin, Gangster No. 1 and Push. He has also directed episodes of Sherlock, Scandal, Monroe and Smash.' ,
            birthyear: '1963'
    },
            imageUrl: 'https://www.imdb.com/title/tt0425210/mediaviewer/rm288767744/?ref_=tt_ov_i',
            year: '2006'
  },
  {
    id: 10,
            title: 'Scarface',
            description:'The story of Cuban refugee Tony Montana (Al Pacino), who arrives penniless in Miami during the Mariel boatlift and becomes a powerful and extremely homicidal drug lord.',
            Genre:
     {
            name: 'Crime',
            description: 'Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre.',

     },       
            director: 
      {
              name: 'Brian De Palma',
              bio: 'Brian Russell De Palma is an American film director and screenwriter. With a career spanning over 50 years, he is best known for his work in the suspense, crime and psychological thriller genres.' ,
              birthyear: '1940'
      },
              imageUrl: 'https://www.imdb.com/title/tt0086250/mediaviewer/rm512766208/?ref_=tt_ov_i',
              year: '1983'
  },
];

//set up logger with morgan
app.use(morgan('common', { stream: accessLogStream }));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix app!');
});

app.get('/movies', (req, res) => {
  Movies.find()
        .then((Movies) => {
            res.status(201).json(Movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//gets data about director
app.get('/movies/:director', (req, res) => {
  res.json(topMovies.find( (topMovies) =>
      {return topMovies.director === req.params.director }));
});

//post request that allows movies to be added to top movie array
app.post('/movies', (req, res) => {
  let newMovie = req.body;

  if (!newMovie.title) {
      const message = 'Missing "title" in request body';
      res.status(400).send(message);
  } else {
      newMovie.id = uuid.v4();
      topMovies.push(newMovie);
      res.status(201).send(newMovie);
  }
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