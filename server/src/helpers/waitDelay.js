function waitDelay(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

module.exports = { waitDelay };
