const { limits } = require('../constants/limits');
const { responses } = require('../constants/responses');
const { waitDelay } = require('../helpers/waitDelay');

let timeOfFirstRequestInCurrentTime;
let requestCount = 0;

async function httpGetIndex(req, res) {
  const { index } = req.params;

  if (!index) {
    res
      .status(responses[400].code)
      .json({ error: true, message: responses[400].noData });

    return;
  }

  if (!timeOfFirstRequestInCurrentTime) {
    timeOfFirstRequestInCurrentTime = Date.now();
  }
  requestCount += 1;

  const timeOfNextRequestInCurrentTime = Date.now();

  // check if the user hasn't exceeded the limits
  if (
    timeOfNextRequestInCurrentTime - timeOfFirstRequestInCurrentTime >=
      limits.time &&
    requestCount >= limits.requestsPerSecond
  ) {
    res
      .status(responses[429])
      .json({ error: true, message: responses[429].message });
  }

  // clear checkpoints after defined period of time
  if (
    timeOfNextRequestInCurrentTime - timeOfFirstRequestInCurrentTime >=
      limits.time &&
    requestCount < limits.requestsPerSecond
  ) {
    timeOfFirstRequestInCurrentTime = timeOfNextRequestInCurrentTime;
    requestCount = 0;
  }

  const delay = Math.floor(
    Math.random() * (limits.maxTime - limits.minTime) + limits.minTime
  );

  waitDelay(delay).then(() => {
    res
      .status(responses[200].code)
      .json({ id: Number(index), value: Number(index) });
  });
}

module.exports = {
  httpGetIndex,
};
