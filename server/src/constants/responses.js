const responses = {
  200: {
    code: 200,
  },
  400: {
    code: 400,
    message: 'No data were provided.',
  },
  429: {
    code: 429,
    message: 'Only 50 requests per second is allowed.',
  },
  503: {
    code: 503,
    message: 'Server error. Please try again later.',
  },
};

module.exports = { responses };
