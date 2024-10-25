import morgan from "morgan";
import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

import xss from "xss-clean";
import expressWinston from "express-winston";
import { catchAsync } from "./utils/catchAsync.js";

// create Express App

const app = express();

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// set Template Engine

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`, { maxAge: "1d" }));

// global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());


app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) {
      return false;
    },
  })
);

import userRouter from "./routes/userRoutes.js";
import AppError from "./utils/AppError.js";
import globalErrorHandler from "./middlewares/globalerrorHandler.js";
import logger from "./utils/logger.js";
import ToDoRouter from "./routes/toDoRoutes.js";

// App Routes

app.use("/api/v1", userRouter);
app.use('/api/v1/toDos',ToDoRouter)


//  not found route for non exist routes

app.all("*", (req, res, next) => {
  logger.error(`Accessing Not Found Route , ${req.originalUrl}`);
  return next(
    new AppError(
      `Not Found Page , No route with your ${req.originalUrl} URL`,
      404
    )
  );
});

app.use(globalErrorHandler);

export default app;
