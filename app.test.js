import { describe, test, expect, beforeEach } from "bun:test";
import request from "supertest";

// IMPORTANT: Adjust this path to wherever your main Express app is defined.
// Make sure you `export const app = express();` in that file!
import { app } from "./app.js";
import db from "@/db.js";

const agent = request.agent(app); // Agents persist cookies/sessions across requests

describe("Task 1: Basic App Setup", () => {
  test("App is exported and responds to requests", async () => {
    const res = await request(app).get("/non-existent-route");
    expect(res.status).toBe(404);
  });
});

describe("Task 2: Registration & Bcrypt", () => {
  beforeEach(() => {
    db._reset();
  });

  test("POST /register creates a user with a hashed password", async () => {
    const res = await request(app)
      .post("/register")
      .send({ username: "testuser", password: "password123" });

    expect(res.status).toBe(201);

    const user = await db.findUserByUsername("testuser");
    expect(user).not.toBeNull();
    expect(user.password).not.toBe("password123"); // Password must be hashed!
  });
});

describe("Tasks 3, 4 & 5: Strategy, Serialization & Login", () => {
  beforeEach(async () => {
    db._reset();
    await request(app).post("/register").send({ username: "authuser", password: "mypassword" });
  });

  test("POST /login authenticates a valid user and establishes a session", async () => {
    const res = await agent.post("/login").send({ username: "authuser", password: "mypassword" });

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined(); // Session cookie created
  });

  test("POST /login rejects invalid credentials", async () => {
    const res = await agent
      .post("/login")
      .send({ username: "authuser", password: "wrongpassword" });

    expect(res.status).toBe(401);
  });
});

describe("Task 6: Protected Routes & Logout", () => {
  beforeEach(async () => {
    db._reset();
    await request(app).post("/register").send({ username: "sessionuser", password: "mypassword" });
    await agent.post("/login").send({ username: "sessionuser", password: "mypassword" });
  });

  test("GET /profile returns user data (requires successful deserializeUser)", async () => {
    const res = await agent.get("/profile");
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("sessionuser");
  });

  test("POST /logout destroys the session", async () => {
    const logoutRes = await agent.post("/logout");
    expect(logoutRes.status).toBe(200);

    const profileRes = await agent.get("/profile");
    expect(profileRes.status).toBe(401); // Unauthorized because session is destroyed
  });
});
