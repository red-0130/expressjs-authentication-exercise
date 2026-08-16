import express from "express";
import session from "express-session";
import morgan from "morgan";
import passport from "passport";

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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
  });
}
