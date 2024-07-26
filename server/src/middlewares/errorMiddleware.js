const { response } = require('../constants/responses');

function errorMiddleware(err, req, res, next) {
  if (err) {
    res.status(response[503].code).json({ message: response[503].message });
  }

  next();
}

module.exports = { errorMiddleware };
