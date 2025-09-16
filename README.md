# myFlix App

myFlix is a full-stack application that allows users to explore movies, register for an account, update their profile, and create a list of favorite movies.  
It is built with **Node.js/Express** on the backend, **MongoDB** for the database, and has a separate frontend client hosted on Netlify.

---

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

This repo contains the API server. 

### Demo Login (optional)
Use this account if you don’t want to sign up:
- Username: `demoUser`  
- Password: `demoPass123`  

Or create your own account via the sign-up page.

---

## Installation & Setup

1. Clone the repository  
   ```bash
   git clone https://github.com/urenami/movie-api.git
   cd movie-api

## Install dependencies

npm install

## Create a .env file with your MongoDB connection string

CONNECTION_URI=mongodb+srv://<username>:<password>@cluster0.abcd123.mongodb.net/myflixDB

## Or, if running MongoDB locally:

CONNECTION_URI=mongodb://localhost:27017/myflixDB

## Start the server

npm start

## Technologies
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
