import db, { type User } from "@/db";
import { comparePasswords } from "@/utils";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user: User | null = await db.findUserByUsername(username);
    if (!user) return done(null, false);
    const [error, isMatch] = await comparePasswords(password, user.password);
    if (error) return done(error);
    if (!isMatch) return done(null, false);
    done(null, user);
  }),
);
