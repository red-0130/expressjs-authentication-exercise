import type { RequestHandler } from "express";

export const authenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Forbidden" });
  }
  next();
};
