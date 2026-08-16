import db from "@/db";
import { comparePasswords } from "@/utils";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await db.findUserByUsername(username);
    if (!user) return done(null, false);
    const [error, isMatch] = await comparePasswords(password, user.password);
    if (error) return done(error);
    if (!isMatch) {
      console.log("Wrong password");
      return done(null, false);
    }
    done(null, user);
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await db.findUserById(id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (error) {
    if (error instanceof Error) return done(error);
    return done(new Error(String(error)));
  }
});

export { passport };
