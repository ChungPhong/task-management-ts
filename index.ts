import express, { Express } from "express";
import cors from "cors";
import * as database from "./config/database";
import dotenv from "dotenv";
import mainV1Routes from "./api/v1/routes/index.route";

dotenv.config();
database.connect();
const app: Express = express();
const port: number | string = process.env.Port || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mainV1Routes(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
