# Getting Started

## Auth

- `POST /api/register`: Register a new user
- `POST /api/login`: Log in a user
- `GET /api/verify-email?code=token`: Verify user email


## Users

- `GET /api/user`: Get all users
- `GET /api/user/:id`: Get user by ID
- `PUT  /api/user/:id`: Update user by ID
- `DELETE /api/user/:id`: Delete user by ID
- `POST /api/user/upload/:id`: Upload profile image

## Movie

- `GET /api/movie`: Get all movies
- `GET /api/movie/:id`: Get movie by ID
- `POST /api/movie`: Create a movie
- `PUT  /api/movie/:id`: Update movie by ID
- `DELETE /api/movie/:id`: Delete movie by ID
- `POST /api/movie/upload/:id`: Upload movie image
