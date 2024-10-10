import express, { Express, Request, Response } from "express";
import * as database from "./config/database";
import dotenv from "dotenv";
import mainV1Routes from "./api/v1/routes/index.route";

dotenv.config();
database.connect();
const app: Express = express();
const port: number | string = process.env.Port || 3000;

mainV1Routes(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
