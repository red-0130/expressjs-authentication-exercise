import db from "@/db";
import { hashedPassword } from "@/utils";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import { passport } from "@/config/passport";
import { authenticated } from "@/middleware/authenticated";

export const app = express();

const PORT = Number(process.env.PORT) || 5173;
const SESSION_SECRET = String(process.env.SESSION_SECRET) || "session-secret-change-on-prod";

app.use(morgan("short"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/ping", (_, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body || { username: "", password: "" };
  if (!username) return res.status(400).json({ error: "username required" });
  if (!password) return res.status(400).json({ error: "password required" });
  const user = await db.findUserByUsername(username);
  if (user) return res.status(400).json({ error: "User already exist" });
  const [error, passwordHash] = await hashedPassword(password);
  if (error) return res.status(500).json({ error: "Unable to hash password" });
  try {
    const { password, ...newUser } = await db.createUser(username, passwordHash);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "User not created" });
  }
});

app.post("/login", passport.authenticate("local"), (_, res) => {
  res.status(200).json({ message: "You are authenticated" });
});

app.get("/profile", authenticated, (req, res) => {
  const { password, ...user } = req.user || {};
  res.json(user);
});

app.post("/logout", (req, res) => {
  if (!req.user) {
    return res.status(300).json({ message: "User not logged in" });
  }
  req.logout((error) => {
    if (error) return res.status(500).json({ error: "Unable to logout user" });
    res.status(200).json({ message: "User is logged out" });
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
  });
}
