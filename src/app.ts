import express from "express";

import cookieParser from "cookie-parser";
import DBConnect from "./config/database";
import apiRouter from "./router";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", apiRouter);

DBConnect()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("listing on port ", 8000);
    });
  })
  .catch((err: Error) => {
    console.log("Error while conneting to DB", err);
  });
