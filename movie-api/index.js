const express = require('express'),
        morgan = require('morgan'),  
        fs = require('fs'),
        path = require('path'),
        uuid = require('uuid'),
        bodyParser = require('body-parser');


// declaring that variable app = deploy express() function
const app = express();

// creating a write stream to go to log.txt
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

// morgan logger, express, body-parser
app.use(morgan('common', { stream: accessLogStream }));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

//My top 10 Movies
let movies = [
  { 
          Title: 'The Dark Knight',
          Description: 'The Batman, police lieutenant James Gordon, and district attorney Harvey Dent, who form an alliance to dismantle organized crime in Gotham City.' ,
          Genre: 
          {
            Name: 'Action',
            Description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
    },
          Director:
    {
            Name: 'Christopher Nolan',
            bio: 'Christopher Edward Nolan CBE is a British-American filmmaker. Known for his Hollywood blockbusters with complex storytelling. Nolan is considered a leading filmmaker of the 21st century.' ,
            Birthyear: '1970'
    },
            imageUrl:'https://www.imdb.com/title/tt0468569/mediaviewer/rm4023877632/?ref_=tt_ov_i',
            year: '2008'
  },

  { 
          Title: 'The Dark Knight Rises',
          Description: 'The revolutionary Bane forces Bruce Wayne to resume his role as Batman and save Gotham City from nuclear destruction.' ,
          Genre:
    {
            Name: 'Action',
            Description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.' 
    },
          Director:
    {
            Name: 'Christopher Nolan',
            bio: 'Christopher Edward Nolan CBE is a British-American filmmaker. Known for his Hollywood blockbusters with complex storytelling. Nolan is considered a leading filmmaker of the 21st century.' ,
            Birthyear: '1970'
    },
            imageUrl:'https://www.imdb.com/title/tt1345836/mediaviewer/rm834516224/?ref_=tt_ov_i',
            year: '2012'
  },  
  {
          Title: 'Coming To America',
          Description: 'The crown prince of the fictional African nation of Zamunda, who travels to the United States in the hopes of finding a woman he can marry and love for who she is, not for her status or for having been trained to please him.' ,
          Genre:
    {
            Name: 'Comedy',
            Description: 'Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter.' ,
    },
          Director: 
    {
            Name: 'John Landis',
            bio: 'John David Landis is an American comedy, horror, and fantasy filmmaker and actor. He is best known for the comedy films that he has directed.' ,
            Birthyear: '1970'
    },
            imageUrl: 'https://www.imdb.com/title/tt0094898/mediaviewer/rm2778142208/?ref_=tt_ov_i',
            year: '1988'
  },
  {
          Title: 'Trading Places',
          Description: 'The story of an upper-class commodities broker (Aykroyd) and a poor street hustler (Murphy) whose lives cross when they are unwittingly made the subject of an elaborate bet to test how each man will perform when their life circumstances are swapped.',
          Genre:
    {
          Name: 'Comedy',
          description: 'Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter.',
    },      
          Director: 
    {
            Name: 'John Landis',
            bio: 'John David Landis is an American comedy, horror, and fantasy filmmaker and actor. He is best known for the comedy films that he has directed.' ,
            Birthyear: '1970'
    },
            imageUrl:'https://www.imdb.com/title/tt0086465/mediaviewer/rm3049141505/?ref_=tt_ov_i',
            year:'1983'
  },
  {
          Title: 'Thor',
          Description: 'After reigniting a dormant war, Thor is banished from Asgard to Earth, stripped of his powers and his hammer. As his brother Loki (Hiddleston) plots to take the Asgardian throne, Thor must prove himself worthy.',
          Genre:
    {
          Name: 'Action',
          Description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
    },
          Director:
    {
            Name: 'Kenneth Branagh',
            bio: 'Joseph Hill Whedon is an American filmmaker, composer, and comic book writer. He is the founder of Mutant Enemy Productions, co-founder of Bellwether Pictures, and is best known as the creator of several television series.' ,
            Birthyear: '1960'
    },
            imageUrl: 'https://www.imdb.com/title/tt0800369/mediaviewer/rm3272546304/?ref_=tt_ov_i',
            year: '2011'
  },
  {
            Title: 'The Avengers',
            Description: 'Nick Fury and the spy agency S.H.I.E.L.D. recruit Tony Stark, Steve Rogers, Bruce Banner, Thor, Natasha Romanoff, and Clint Barton to form a team capable of stopping Thors brother Loki from subjugating Earth.',
            Genre:
    {
            Name: 'Action',
            description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
    },
          Director: 
    {
            Name: 'Joss Whedon',
            bio: 'John David Landis is an American comedy, horror, and fantasy filmmaker and actor. He is best known for the comedy films that he has directed.' ,
            Birthyear: '1964'
    },
            imageUrl: 'https://www.imdb.com/title/tt0848228/mediaviewer/rm3955117056/?ref_=tt_ov_i',
            year: '2012'
  },
  {
          Title: 'Avengers: Infinity War',
          Description: 'The Avengers and the Guardians of the Galaxy attempt to prevent Thanos from collecting the six all-powerful Infinity Stones as part of his quest to kill half of all life in the universe.',
          Genre:
    {
            Name: 'Action',
            Description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
    },      
          Director: 
    {
            Name: 'Anthony Russo, Joe Russo',
            bio: 'Anthony Russo and Joseph Russo, collectively known as the Russo brothers, are American directors, producers, and screenwriters. They direct most of their work together. They are best known for directing four films in the Marvel Cinematic Universe.' ,
            Birthyear: '1970, 1971'
    },
            imageUrl: 'https://www.imdb.com/title/tt4154756/mediaviewer/rm4044245504/?ref_=tt_ov_i',
            year: '2018'
  },
  {
          Title: 'Avengers: End Game ',
          Description: 'The surviving members of the Avengers and their allies attempt to reverse Thanos actions in Infinity War.',
          Genre:
    {
            Name: 'Action',
            Description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
    },      
          Director: 
    {
            Name: 'Anthony Russo, Joe Russo',
            bio: 'Anthony Russo and Joseph Russo, collectively known as the Russo brothers, are American directors, producers, and screenwriters. They direct most of their work together. They are best known for directing four films in the Marvel Cinematic Universe.' ,
            Birthyear: '1970, 1971'
    },
            imageUrl: 'https://www.imdb.com/title/tt4154796/mediaviewer/rm2775147008/?ref_=tt_ov_i',
            year: '2019'       
  },
  {
          Title: 'Lucky Number Slevin',
          Description: 'Revolves around an innocent man dragged into the middle of a war being plotted by two of New York Citys rival crime bosses.',
          Genre:
    {
            Name: 'Crime',
            Description: 'Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre.',
    },      
          Director: 
    {
            Name: 'Paul McGuigan',
            bio: 'Paul McGuigan is a Scottish film and television director, best known for directing films such as Lucky Number Slevin, Gangster No. 1 and Push. He has also directed episodes of Sherlock, Scandal, Monroe and Smash.' ,
            Birthyear: '1963'
    },
            imageUrl: 'https://www.imdb.com/title/tt0425210/mediaviewer/rm288767744/?ref_=tt_ov_i',
            year: '2006'
  },
  {
            Title: 'Scarface',
            Description:'The story of Cuban refugee Tony Montana (Al Pacino), who arrives penniless in Miami during the Mariel boatlift and becomes a powerful and extremely homicidal drug lord.',
            Genre:
     {
            Name: 'Crime',
            Description: 'Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre.',

     },       
            Director: 
      {
              Name: 'Brian De Palma',
              bio: 'Brian Russell De Palma is an American film director and screenwriter. With a career spanning over 50 years, he is best known for his work in the suspense, crime and psychological thriller genres.' ,
              Birthyear: '1940'
      },
              imageUrl: 'https://www.imdb.com/title/tt0086250/mediaviewer/rm512766208/?ref_=tt_ov_i',
              year: '1983'
  },
];

let users = [
        {
            id: '1',
            name: 'Mike',
            favoriteMovieList: []
        },
        {
            id: '2',
            name: 'Ana',
            favoriteMovieList: []
        },
        {
            id: '3',
            name: 'Michael',
            favoriteMovieList: ["Avenger: End Game, The Dark Knight"]
        }
]

//READ
app.get('/documentation', (req, res) => {                  
        console.log('Documentation Request');
        res.sendFile('public/Documentation.html', {root: __dirname});
      });

// GET requests
app.get('/', (req, res) => {
  console.log('Welcome to myFlix app!');     
  res.send('Welcome to myFlix app!');
});

app.get('/movies', (req, res) => {
  res.status(200).json(movies);
  console.log('Movies request');
});

//get request to get info on movie using title
app.get('/movies/:title', (req, res) => {
  const {title} = req.params;
  const movie = movies.find(movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else{
    res.status(400).send('no such movie')
  }
});

//get request to get genre of a movie
app.get('/movies/genre/:genreName', (req, res) => {
  const {genreName} = req.params;
  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else{
    res.status(400).send('no such genre')
  }
});

app.get('/movies/director/:directorName',(req,res)=>{
  const {directorName} =req.params;
  const director = movies.find(movie => movie.Director.Name === directorName).Director;

  if (director){
      res.status(200).json(director);
  }else{
      res.status(400).send('no such director found');
  }
});

//CREATE
app.post('/users', (req,res) => {
        const newUser = req.body;
      
        if (newUser.name) {
          newUser.id = uuid.v4();
          users.push(newUser);
          res.status(201).json(newUser)
          }
          else {
            res.status(400).send('new user not found')
          }
      });
      
      app.post('/users/:id/:favoriteMovieTitle', (req,res)=>{
        const{id, favoriteMovieTitle}=req.params;
      
        let user=users.find(user=>user.id == id);
      
        if(user){
            user.favoriteMovieList.push(favoriteMovieTitle);
            res.status(201).send('movie added to your favorites list');
            console.log(favoriteMovieTitle);
        }else{
            res.status(400).send('movie not added');
        }
      });
      
      
      //UPDATE
      app.put('/users/:id', (req, res)=>{
        const {id}=req.params;
        const updateUser=req.body;
      
        let user = users.find(user => user.id === id );
      
        if(user){
            user.name = updateUser.name;
            res.status(200).json(user);
        }else{
            res.status(400).send('no such user');
        }
      });
      
      
      //DELTE
      app.delete('/users/:id/:favoriteMovieTitle', (req,res)=>{
        const {id, favoriteMovieTitle} =req.params;
      
        let user = users.find(user=>user.id ==id);
      
        if(user){ user.favoriteMovieList=user.favoriteMovieList.filter(title=>title !== favoriteMovieTitle);
            res.status(201).send('movie was deleted from your favorites');
        }else{
            res.status(400).send('movie was not deleted');
        }
      });
      
      app.delete('/users/:id', (req, res) => {
        const {id} = req.params;

        let user = users.find(user => user.id === id );

  if (user) {
    users = users.filter(user => user.id !== req.params.id);
    res.status(201).send('User account ' + req.params.id + ' was deleted.');
  }
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