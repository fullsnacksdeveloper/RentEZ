//Centralized error handler

const errorHandling = (err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    status: 500,
    message: "Oopsie, you got a little problem",
    error: err.message
  });
};

module.exports = errorHandling;
