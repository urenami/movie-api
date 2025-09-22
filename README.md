# myFlix App

myFlix is a full-stack application that allows users to explore movies, register for an account, update their profile, and create a list of favorite movies.
Backend: Node.js/Express API with MongoDB & JWT authentication (deployed on Render)
Frontend: React client (deployed on Netlify)

## Features

- **User Accounts**  
  - Register, log in, update profile info, or delete account  
  - Secure password hashing & JWT authentication  

- **Movies API**  
  - Get a full list of movies  
  - Retrieve details about a movie by title  
  - Get information on directors and genres  

- **Favorites**  
  - Add or remove movies from your favorites list  

---

## Live Demo
- **Frontend (Netlify):** 

[myFlix Client](https://ezmyflixapp.netlify.app/login)

- **Backend (Local or Deployable):** 

 https://movie-api-ponl.onrender.com/

### Demo Login (optional)
Use this account if you don’t want to sign up:
- Username: `testdemo`  
- Password: `demopass123`  

Or create your own account via the sign-up page.

---

## Installation & Setup

# Clone repo
git clone https://github.com/urenami/movie-api.git
cd movie-api

# Install dependencies
npm install

# Create a .env file
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/myFlixDB
JWT_SECRET=mysupersecretjwtkey12345

# Start server
npm start


## Technologies
- React (Frontend, Netlify)
- Node.js / Express  
- MongoDB / Mongoose  
- Passport & JWT Authentication  

## API Endpoints (Examples)

POST   /users                       → Register new user
POST   /login                       → Login and receive token
GET    /movies                      → Get all movies (requires token)
GET    /movies/:Title               → Get movie by title
POST   /users/:Username/movies/:ID  → Add movie to favorites
DELETE /users/:Username/movies/:ID  → Remove movie from favorites
PUT    /users/:Username             → Update user info
DELETE /users/:Username             → Delete user account

## 📌 Versioning

- **v1.0.0 (main branch)**  
Full-stack app (React client + Node API) deployed and working.

- **v2 (development branch)**  
  TMDB integration, improved UI, and additional features.
