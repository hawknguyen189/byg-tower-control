var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.get("/foobar", (req, res, next) => {
  const checkFooBar = async () => {
    let data;
    try {
      const response = await fetch(
        "https://be.blackeyegalaxy.space/v1/asteroids/576?address=0xf67F0a051fd60bC77ac410D26b4cD10E8b4a21d2"
      );
      console.log("respone", response);
      data = await response.json();
    } catch (error) {
      console.log("error", error);
    }
    res.json(data);
  };
  checkFooBar();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
