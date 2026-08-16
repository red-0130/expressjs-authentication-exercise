# Express & Passport.js Authentication Exercise

This exercise is designed to help you practice authentication with Express, Passport.js, Bcrypt, and Bun.
It is broken down into confirmable tasks. You can run the test suite after each task to check your progress.

## Setup Instructions

1. Initialize your Bun project: `bun init -y`
2. Install the required dependencies:
   ```bash
   bun add express express-session passport passport-local bcrypt
   bun add -d supertest @types/supertest @types/express
   ```
3. Make sure you have `mock-db.js` and `app.test.js` in your project root.
4. Create your main application file (e.g., `app.js`).

## Using the Mock Database

The `mock-db.js` file contains a simple in-memory database to simulate user storage. To use it in your application, simply import the `db` object into your routes or passport config file:

```javascript
import { db } from "./mock-db.js";

// Example usage:
// const user = await db.findUserByUsername("testuser");
// const newUser = await db.createUser("testuser", "hashedPassword123");
// const userById = await db.findUserById("12345");
```

## The Task

Work through these tasks one by one. Run `bun test` at any time to verify your work.

### Task 1: Basic App Setup

- [x] Create your main application file.

  - [x] Initialize an Express application.
  - [x] Apply standard middleware (`express.json()` and `express.urlencoded({ extended: true })`).
  - [x] Configure `express-session` with a secret and set `resave: false` and `saveUninitialized: false`.
  - [x] Initialize Passport (`app.use(passport.initialize())` and `app.use(passport.session())`).
  - [x] **Crucial:** Ensure you export your app instance (e.g., `export const app = express()`) so the test file can mount it.

### Task 2: User Registration & Bcrypt

- [ ] Create a `POST /register` route.
- [ ] Extract `username` and `password` from the request body.
- [ ] Use `bcrypt.hash()` to securely encrypt the password.
- [ ] Save the user using the `db.createUser(username, hashedPassword)` function.
- [ ] Return a `201` status code upon success.

### Task 3: Configure the Local Strategy

- [ ] Import `LocalStrategy` from `passport-local`.
- [ ] Call `passport.use(new LocalStrategy(...))`
- [ ] In the verify callback, use `db.findUserByUsername()` to locate the user.
- [ ] If the user exists, use `bcrypt.compare()` to check if the provided password matches the hashed password in the mock database.
- [ ] Return the `done` callback appropriately for success, failure (wrong password), and non-existent users.

### Task 4: Serialization and Deserialization

For sessions to work, Passport needs to know how to store and retrieve the user from the session cookie.

- [ ] Implement `passport.serializeUser()`. It should take the authenticated user object and return _only_ the user's `id` to be stored in the cookie.
- [ ] Implement `passport.deserializeUser()`. It should take the `id` from the cookie, use `db.findUserById(id)`, and return the full user object to be attached to `req.user`.

### Task 5: The Login Endpoint

- [ ] Create a `POST /login` route.
- [ ] Use `passport.authenticate('local')` as middleware for this route.
- [ ] You can let Passport handle the response automatically, or use a custom callback, but for this task, simply ensuring a `200` status is returned upon successful authentication is enough.

### Task 6: Protected Routes and Logout

- [ ] Create a `GET /profile` route.
- [ ] In this route, check if the user is authenticated (hint: Passport adds `req.isAuthenticated()` to the request object). If they aren't, return a `401` status. If they are, return the user object (`req.user`) as JSON.
- [ ] Create a `POST /logout` route.
- [ ] Inside this route, invoke the `req.logout()` function. Remember that in modern versions of Passport, `req.logout()` is asynchronous and accepts a callback function to handle errors or send the response. Send a `200` status when logout is complete.
