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


// const whitelist = ['http://localhost:5173', 'https://categorymanagementui.netlify.app']
// const corsOptions = {
//   origin: function (origin:string|undefined, callback: (arg0: Error | null, arg1?: boolean | undefined) => void) {
//     console.log("origin is ",origin)
//     if (origin && whitelist.indexOf(origin) !== -1) {
//         console.log("origin is ",origin)
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
// app.use(cors(corsOptions))
app.use(cors())

app.use("/.netlify/functions/app", apiRouter);
// const handler = serverless(app);
module.exports.handler = serverless(app);

