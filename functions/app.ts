import express from "express";
import serverless from "serverless-http";
import cookieParser from "cookie-parser";
import cors from 'cors'
import "./config/database";
import apiRouter from "./router";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())


app.use("/.netlify/functions/app", apiRouter);
// const handler = serverless(app);
module.exports.handler = serverless(app);
// async (event: object, context: object) => {
//     const result = await handler(event, context);
//     return result;
// }
