import express, { Application } from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import { Mongo, mongoClient } from './configuration/database'; /** import the database configuration */

import routes from "./route";

const database: Mongo = new Mongo(); /* export the mongo class */

/* check for the port number in environment PORT variable or set 5002 PORT */
const PORT: string | number = process.env.PORT || 5010;


const checkDb = async () => {
  try {
    await database.mongoSetup();
    console.log("Connection has been established successfully");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

export const get = () => {
  const app: Application = express();

  // Body parsing Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/v1", routes);

  return app;
};

export const start = () => {
  const app: Application = get();

  try {
    app.listen(PORT, () => {
      console.log(`Employee Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Error occurred: ${error['message']}`);
  }
};

checkDb();
start();
