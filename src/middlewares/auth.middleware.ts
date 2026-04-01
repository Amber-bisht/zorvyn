import { Request, Response, NextFunction } from "express";

// This middleware will check session 
// If user is not logged in, then it will return from here
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    return next();
  }

  res.status(401).json({ message: "Please login first! We Check Login Stop Messing with me" });
};
