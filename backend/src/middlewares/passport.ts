import { Express, Request, Response } from "express";
import passport from "passport";
import { Strategy as PassportLocalStrategy } from "passport-local";
import { IUser, User } from "../models/user.model";
import { BadRequestException } from "../utils/exceptions/bad-request-exception";
import { UnauthorizedException } from "../utils/exceptions/unauthorized-exception";

export interface RequestUser {
  id: string | undefined;
  username: string | undefined;
  isAdmin: boolean | undefined;
}

class InvalidUsernameOrPassword extends BadRequestException {
  constructor() {
    super("Invalid username or password");
  }
}

export function configurePassport(app: Express) {
  passport.use(
    "local",
    new PassportLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findByUsername(username);
        if (!user) throw new InvalidUsernameOrPassword();
        const isMatch = await user.comparePassword(password);
        if (isMatch) {
          const requestUser: RequestUser = {
            id: user._id,
            username: user.username,
            isAdmin: user.isAdmin,
          };
          return done(null, requestUser);
        }
        throw new InvalidUsernameOrPassword();
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser(function (user, done) {
    if (!user) return done(new Error("No user to serialize"), null);
    return done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    if (!user) return done(new Error("No user to deserialize"), null);
    return done(null, user);
  });
  app.use(passport.initialize());
  app.use(passport.session());
}

export function authenticate(req: Request, res: Response): Promise<void> {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err: unknown, user: IUser) => {
      if (err) return reject(err);
      if (!user) return reject(new Error("Not authenticated"));

      req.login(user, (err) => {
        if (err) return reject(err);
        resolve();
      });
    })(req, res);
  });
}

export function getRequestUser(req: Request): RequestUser {
  if (!req.isAuthenticated()) throw new UnauthorizedException();
  if (!req.user) throw new UnauthorizedException();
  return req.user as any;
}
