import express from "express";
import serverless from "serverless-http";
import cookieParser from "cookie-parser";

import "./config/database";
import apiRouter from "./router";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// const router = express.Router();

// app.listen(process.env.PORT || 8000, () => {
//   console.log("listing on port ", 8000);
// });

// DBConnect()
//   .then(() => {
//     app.listen(process.env.PORT || 8000, () => {
//       console.log("listing on port ", 8000);
//     });
//   })
//   .catch((err: Error) => {
//     console.log("Error while conneting to DB", err);
//   });

app.use("/.netlify/functions/app", apiRouter);
// const handler = serverless(app);
module.exports.handler = serverless(app);
// async (event: object, context: object) => {
//     const result = await handler(event, context);
//     return result;
// }
