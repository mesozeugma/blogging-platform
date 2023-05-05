import express, { Express } from "express";
import session from "express-session";
import mongoose from "mongoose";
import path from "path";

import { userRoute } from "./routes/user";
import { configurePassport } from "./middlewares/passport";
import { errorHandlerMiddleware } from "./middlewares/error-handler";
import { routeNotFound } from "./middlewares/route-not-found";
import { seedUsers } from "./db/bootstrap";
import { postRoute } from "./routes/post";
import { getConfig } from "./utils/config";

function applyPostRouteMiddleware(app: Express) {
  app.use(errorHandlerMiddleware);
}

async function start() {
  const config = getConfig();
  const app = express();

  console.log("Connecting to mongodb...");
  await mongoose.connect(config.mongodbUrl);
  console.log("Connected to mongodb");
  await seedUsers();

  app.use(
    session({
      secret: config.cookieSecret,
      resave: true,
      saveUninitialized: false,
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  configurePassport(app);

  app.use("/api/users", userRoute);
  app.use("/api/posts", postRoute);
  app.use("/api", routeNotFound);

  const publicDirectory = path.resolve(__dirname, "../public");
  console.log(`Serving static files from ${publicDirectory}`);
  app.use(express.static(publicDirectory));
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(publicDirectory, "index.html"));
  });
  applyPostRouteMiddleware(app);

  app.listen(config.serverPort, () => {
    console.log(`Server started listening on port ${config.serverPort}`);
  });
}

start();
