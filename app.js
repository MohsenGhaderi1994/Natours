const express = require("express");

const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());

app.use(morgan("dev"));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`timestamp attached to the req. new req is ${req.requestTime}`);
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
