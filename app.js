const colors = require("colors");
const createError = require("http-errors");
const express = require("express");
const { notFound, errorHandler } = require("./middleware/error");
const connectDB = require("./db");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const tweetRouter = require("./routes/tweet");
const usersRouter = require("./routes/users");

connectDB();
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/tweet", tweetRouter);
app.use("/users", usersRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
